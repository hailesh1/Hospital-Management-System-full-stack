import { query } from '@/lib/db';
import { randomUUID } from 'crypto';

const STATUS_CACHE_KEY = '__invoices_status_cache__';
const STATUS_CACHE_TTL_MS = 10 * 60 * 1000;

async function getAllowedStatuses() {
    const now = Date.now();
    const cached = global[STATUS_CACHE_KEY];
    if (cached && (now - cached.ts) < STATUS_CACHE_TTL_MS) {
        return cached.data;
    }
    try {
        const res = await query("SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conrelid = 'invoices'::regclass AND conname ILIKE '%status%'");
        const defs = res.rows.map(r => r.def || '');
        let allowed = [];
        for (const def of defs) {
            // Match ARRAY[...] style (including ANY(ARRAY[...]::text[]))
            const arrayMatch = def.match(/ARRAY\[(.*?)\]/);
            if (arrayMatch && arrayMatch[1]) {
                const items = arrayMatch[1].split(',').map(s => s.trim());
                const values = items.map(s => {
                    const q = s.match(/'([^']+)'/);
                    return q ? q[1] : s.replace(/::text/g, '').replace(/"/g, '');
                }).filter(Boolean);
                allowed = allowed.concat(values);
                continue;
            }
            // Match IN ('a','b','c') style
            const inMatch = def.match(/IN\s*\(\s*([^)]+)\s*\)/i);
            if (inMatch && inMatch[1]) {
                const items = inMatch[1].split(',').map(s => s.trim());
                const values = items.map(s => {
                    const q = s.match(/'([^']+)'/);
                    return q ? q[1] : s.replace(/::text/g, '').replace(/"/g, '');
                }).filter(Boolean);
                allowed = allowed.concat(values);
                continue;
            }
            // Match equality style: (status = 'paid')
            const eqMatch = def.match(/\(\s*status\s*=\s*'([^']+)'\s*\)/i);
            if (eqMatch) {
                allowed.push(eqMatch[1]);
            }
        }
        allowed = Array.from(new Set(allowed));
        
        if (allowed.length === 0) {
            console.warn('No statuses found from DB constraint, using fallback');
            allowed = ['PAID', 'PENDING', 'OVERDUE', 'CANCELLED'];
        }

        global[STATUS_CACHE_KEY] = { ts: now, data: allowed };
        return allowed;
    } catch (error) {
        console.error('Error fetching allowed statuses:', error);
        // Fallback to known statuses if DB introspection fails
        return ['PAID', 'PENDING', 'OVERDUE', 'CANCELLED'];
    }
}

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                let { patient_id } = req.query;

                // Handle mock/demo patient IDs only if they don't exist in the database
                if (patient_id) {
                    const idExists = await query('SELECT id FROM patients WHERE id = $1', [patient_id]);
                    if (idExists.rows.length === 0) {
                        if (patient_id === '3' || !patient_id.includes('-')) {
                            const defaultPatient = await query('SELECT id FROM patients LIMIT 1');
                            if (defaultPatient.rows.length > 0) {
                                patient_id = defaultPatient.rows[0].id;
                            }
                        }
                    }
                }

                let queryString = `
                    SELECT i.*, 
                           (p.first_name || ' ' || p.last_name) as p_name
                    FROM invoices i
                    LEFT JOIN patients p ON i.patient_id = p.id
                `;

                const queryParams = [];
                if (patient_id) {
                    queryString += ` WHERE i.patient_id = $1`;
                    queryParams.push(patient_id);
                }

                queryString += ' ORDER BY i.created_at DESC';

                const result = await query(queryString, queryParams);

                const invoices = result.rows.map(inv => ({
                    id: inv.id,
                    patientName: inv.p_name || inv.patient_name || 'Unknown Patient',
                    date: inv.created_at ? new Date(inv.created_at).toISOString().split('T')[0] : null,
                    dueDate: inv.due_date ? new Date(inv.due_date).toISOString().split('T')[0] : null,
                    total: parseFloat(inv.total || inv.amount || 0),
                    status: inv.status,
                    subtotal: parseFloat(inv.total || inv.amount || 0),
                    tax: 0,
                    paidDate: inv.paid_date ? new Date(inv.paid_date).toISOString().split('T')[0] : null,
                    paymentMethod: inv.payment_method,
                    items: typeof inv.items === 'string' ? JSON.parse(inv.items) : inv.items || []
                }));

                res.status(200).json(invoices);
            } catch (error) {
                console.error('Error fetching invoices:', error);
                res.status(500).json({ error: 'Failed to fetch invoices: ' + error.message });
            }
            break;

        case 'POST':
            try {
                let { patient_id, patient_name, total, status, items, due_date } = req.body;

                const colsRes = await query("SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'invoices'");
                const cols = new Map(colsRes.rows.map(r => [r.column_name, { data_type: r.data_type, is_nullable: r.is_nullable, column_default: r.column_default }]));

                const desired = [
                    ['patient_id', patient_id],
                    ['patient_name', patient_name],
                    ['total', total],
                    ['items', items ? JSON.stringify(items) : null],
                    ['due_date', due_date],
                ];
                const allCols = [];
                const allValues = [];
                for (const [col, val] of desired) {
                    if (cols.has(col)) {
                        allCols.push(col);
                        allValues.push(val);
                    }
                }

                if (cols.has('id')) {
                    const meta = cols.get('id');
                    const hasDefault = meta.column_default !== null;
                    if (!hasDefault) {
                        allCols.unshift('id');
                        allValues.unshift(randomUUID());
                    }
                }

                if (cols.has('status')) {
                    const meta = cols.get('status');
                    const hasDefault = meta.column_default !== null;
                    if (!hasDefault) {
                        const allowed = await getAllowedStatuses();
                        let chosen = null;
                        if (status) {
                            const idx = allowed.findIndex(a => String(a).toLowerCase() === String(status).toLowerCase());
                            if (idx >= 0) {
                                chosen = allowed[idx];
                            }
                        }
                        if (!chosen) {
                            chosen = allowed.length > 0 ? allowed[0] : status || null;
                        }
                        if (chosen === null) {
                            return res.status(400).json({
                                error: 'Invalid invoice status',
                                details: 'status must satisfy invoices_status_check',
                                allowed: allowed
                            });
                        }
                        allCols.push('status');
                        allValues.push(chosen);
                    }
                }

                let dateCol = null;
                if (cols.has('created_at')) dateCol = 'created_at';
                else if (cols.has('date')) dateCol = 'date';

                const placeholders = allCols.map((_, i) => `$${i + 1}`).join(', ');
                const nowExpr = dateCol === 'date' ? 'CURRENT_DATE' : 'NOW()';

                const text = `
                    INSERT INTO invoices (${[...allCols, ...(dateCol ? [dateCol] : [])].join(', ')})
                    VALUES (${placeholders}${dateCol ? `, ${nowExpr}` : ''})
                    RETURNING *
                `;
                const values = allValues;

                const result = await query(text, values);

                res.status(201).json(result.rows[0]);
            } catch (error) {
                console.error('Error creating invoice:', error);
                res.status(500).json({
                    error: 'Failed to create invoice',
                    details: error.message,
                    code: error.code
                });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
