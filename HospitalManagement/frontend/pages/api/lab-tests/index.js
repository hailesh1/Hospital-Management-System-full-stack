import { query } from '@/lib/db';
import { randomUUID } from 'crypto';

const STATUS_CACHE_KEY = '__lab_tests_status_cache__';
const STATUS_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const TEST_TYPE_CACHE_KEY = '__lab_tests_test_type_cache__';
const TEST_TYPE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function getAllowedStatuses() {
  const now = Date.now();
  const cached = global[STATUS_CACHE_KEY];
  if (cached && (now - cached.ts) < STATUS_CACHE_TTL_MS) {
    return cached.data;
  }
  try {
    const res = await query("SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conrelid = 'lab_tests'::regclass AND conname ILIKE '%status%'");
    const defs = res.rows.map(r => r.def || '');
    let allowed = [];
    for (const def of defs) {
      const m = def.match(/ARRAY\[(.*?)\]/);
      if (m && m[1]) {
        const items = m[1].split(',').map(s => s.trim());
        const values = items.map(s => {
          const q = s.match(/'([^']+)'/);
          return q ? q[1] : s.replace(/::text/g, '').replace(/"/g, '');
        }).filter(Boolean);
        allowed = allowed.concat(values);
      } else {
        const inMatch = def.match(/\(\s*status\s*=\s*'([^']+)'\s*\)/);
        if (inMatch) {
          allowed.push(inMatch[1]);
        }
      }
    }
    allowed = Array.from(new Set(allowed));
    global[STATUS_CACHE_KEY] = { ts: now, data: allowed };
    return allowed;
  } catch {
    return [];
  }
}

async function getAllowedTestTypes() {
  const now = Date.now();
  const cached = global[TEST_TYPE_CACHE_KEY];
  if (cached && (now - cached.ts) < TEST_TYPE_CACHE_TTL_MS) {
    return cached.data;
  }
  try {
    const res = await query("SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conrelid = 'lab_tests'::regclass AND conname ILIKE '%test_type%'");
    const defs = res.rows.map(r => r.def || '');
    let allowed = [];
    for (const def of defs) {
      const m = def.match(/ARRAY\[(.*?)\]/);
      if (m && m[1]) {
        const items = m[1].split(',').map(s => s.trim());
        const values = items.map(s => {
          const q = s.match(/'([^']+)'/);
          return q ? q[1] : s.replace(/::text/g, '').replace(/"/g, '');
        }).filter(Boolean);
        allowed = allowed.concat(values);
      } else {
        const anyMatch = def.match(/ANY\s*\(\s*ARRAY\[(.*?)\]\s*\)/);
        if (anyMatch && anyMatch[1]) {
          const items = anyMatch[1].split(',').map(s => s.trim());
          const values = items.map(s => {
            const q = s.match(/'([^']+)'/);
            return q ? q[1] : s.replace(/::text/g, '').replace(/"/g, '');
          }).filter(Boolean);
          allowed = allowed.concat(values);
        } else {
          const eqMatch = def.match(/\(\s*test_type\s*=\s*'([^']+)'\s*\)/);
          if (eqMatch) {
            allowed.push(eqMatch[1]);
          }
        }
      }
    }
    allowed = Array.from(new Set(allowed));
    global[TEST_TYPE_CACHE_KEY] = { ts: now, data: allowed };
    return allowed;
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const { patient_id } = req.query;
                let text = 'SELECT * FROM lab_tests';
                let values = [];

                if (patient_id) {
                    text += ' WHERE patient_id = $1';
                    values.push(patient_id);
                }

                text += ' ORDER BY created_at DESC';
                const result = await query(text, values);

                const mapped = result.rows.map(row => ({
                    id: row.id,
                    patientId: row.patient_id,
                    patientName: row.patient_name,
                    testName: row.test_name,
                    testType: row.test_type,
                    orderedBy: row.ordered_by,
                    orderedDate: row.ordered_date ? new Date(row.ordered_date).toISOString().split('T')[0] : null,
                    status: row.status,
                    result: row.result,
                    notes: row.notes
                }));

                res.status(200).json(mapped);
            } catch (error) {
                console.error('Error fetching lab tests:', error);
                res.status(500).json({ error: 'Failed to fetch lab tests' });
            }
            break;

        case 'POST':
            try {
                let { patientId, testName, testType, orderedBy, notes, doctorId } = req.body;

                if (!patientId || !testName) {
                    return res.status(400).json({ error: 'Patient ID and Test Name are required' });
                }

                // Translate ID and fetch patient name
                let patientName = 'Unknown';
                if (patientId && (patientId.length < 32 || !patientId.includes('-'))) {
                    const patientCheck = await query("SELECT id, first_name || ' ' || last_name AS name FROM patients WHERE id::text ILIKE $1 OR first_name || ' ' || last_name ILIKE $2 LIMIT 1", [`%${patientId}%`, `%${patientId}%`]);
                    if (patientCheck.rows.length > 0) {
                        patientId = patientCheck.rows[0].id;
                        patientName = patientCheck.rows[0].name || 'Unknown';
                    }
                }
                if (patientName === 'Unknown') {
                    const patientRes = await query('SELECT first_name || \' \' || last_name as name FROM patients WHERE id = $1', [patientId]);
                    patientName = patientRes.rows.length > 0 ? patientRes.rows[0].name : 'Unknown';
                }

                const colsRes = await query("SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'lab_tests'");
                const cols = new Map(colsRes.rows.map(r => [r.column_name, { data_type: r.data_type, is_nullable: r.is_nullable, column_default: r.column_default }]));

                const desired = [
                  ['patient_id', patientId],
                  ['patient_name', patientName],
                  ['test_name', testName],
                  ['ordered_by', orderedBy],
                  ['notes', notes],
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

                if (cols.has('doctor_id')) {
                  const meta = cols.get('doctor_id');
                  const nullable = String(meta.is_nullable || '').toUpperCase() === 'YES';
                  const hasDefault = meta.column_default !== null;
                  const hasValue = doctorId !== undefined && doctorId !== null && String(doctorId).length > 0;
                  if (!nullable && !hasDefault && !hasValue) {
                    return res.status(400).json({ error: 'Doctor ID is required', details: 'doctor_id is NOT NULL and has no default in lab_tests table' });
                  }
                  allCols.push('doctor_id');
                  allValues.push(hasValue ? doctorId : null);
                }

                if (cols.has('status')) {
                  const meta = cols.get('status');
                  const hasDefault = meta.column_default !== null;
                  if (!hasDefault) {
                    const allowed = await getAllowedStatuses();
                    const chosen = allowed.length > 0 ? allowed[0] : 'PENDING';
                    allCols.push('status');
                    allValues.push(chosen);
                  }
                }

                if (cols.has('test_type')) {
                  const meta = cols.get('test_type');
                  const hasDefault = meta.column_default !== null;
                  if (!hasDefault) {
                    const allowed = await getAllowedTestTypes();
                    let chosen = null;
                    if (testType) {
                      const idx = allowed.findIndex(a => String(a).toLowerCase() === String(testType).toLowerCase());
                      if (idx >= 0) {
                        chosen = allowed[idx];
                      }
                    }
                    if (!chosen) {
                      chosen = allowed.length > 0 ? allowed[0] : testType || null;
                    }
                    if (chosen === null) {
                      return res.status(400).json({
                        error: 'Invalid test type',
                        details: 'test_type must satisfy lab_tests_test_type_check',
                        allowed: allowed
                      });
                    }
                    allCols.push('test_type');
                    allValues.push(chosen);
                  }
                }

                let dateCol = null;
                if (cols.has('ordered_date')) dateCol = 'ordered_date';
                else if (cols.has('created_at')) dateCol = 'created_at';
                else if (cols.has('date')) dateCol = 'date';

                const placeholders = allCols.map((_, i) => `$${i + 1}`).join(', ');
                const nowExpr = dateCol === 'date' ? 'CURRENT_DATE' : 'NOW()';

                const text = `
                    INSERT INTO lab_tests (${[...allCols, ...(dateCol ? [dateCol] : [])].join(', ')})
                    VALUES (${placeholders}${dateCol ? `, ${nowExpr}` : ''})
                    RETURNING *
                `;
                const values = allValues;

                const result = await query(text, values);
                res.status(201).json(result.rows[0]);
            } catch (error) {
                console.error('Error creating lab test:', error);
                res.status(500).json({
                  error: 'Failed to create lab test',
                  details: error.message,
                  code: error.code,
                  hint: 'Ensure doctor_id/status constraints allow NULL or have defaults, and that patient_id exists.'
                });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
