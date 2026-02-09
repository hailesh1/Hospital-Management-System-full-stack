import { query } from '@/lib/db';
import { randomUUID } from 'crypto';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                let { patientId, patient_id } = req.query;
                patientId = patientId || patient_id;

                // Handle mock/development patient IDs or missing patient IDs; accept email too
                if (patientId) {
                    const patientCheck = await query(
                        "SELECT id FROM patients WHERE LOWER(TRIM(id::text)) = LOWER(TRIM($1)) OR LOWER(TRIM(email)) = LOWER(TRIM($1)) LIMIT 1",
                        [patientId]
                    );
                    if (patientCheck.rows.length === 0) {
                        console.warn(`[API] GET: Patient ID "${patientId}" NOT FOUND even with TRIM/LOWER.`);
                        return res.status(200).json([]);
                    }
                    patientId = patientCheck.rows[0].id;
                }

                // Inspect existing columns on medical_records to avoid referencing missing columns
                const colsRes = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'medical_records'");
                const cols = new Set(colsRes.rows.map(r => r.column_name));

                const selectParts = [];
                selectParts.push('mr.id');
                selectParts.push("mr.patient_id as \"patientId\"");
                selectParts.push("CONCAT(p.first_name, ' ', p.last_name) as patient");
                selectParts.push("CONCAT(p.first_name, ' ', p.last_name) as patient_name");
                selectParts.push('mr.doctor_name as doctor');

                // date column fallback
                if (cols.has('created_at')) selectParts.push('mr.created_at as date');
                else if (cols.has('date')) selectParts.push('mr.date as date');
                else selectParts.push('NOW() as date');

                // title/diagnosis fallbacks
                if (cols.has('title') && cols.has('diagnosis')) {
                    selectParts.push("COALESCE(mr.title, mr.diagnosis, 'Medical Record') as title");
                } else if (cols.has('diagnosis')) {
                    selectParts.push("COALESCE(mr.diagnosis, 'Medical Record') as title");
                } else if (cols.has('title')) {
                    selectParts.push("COALESCE(mr.title, 'Medical Record') as title");
                } else {
                    selectParts.push("'Medical Record' as title");
                }

                // notes/description
                if (cols.has('notes')) selectParts.push('mr.notes as description');
                else selectParts.push("'' as description");

                // type
                if (cols.has('type')) selectParts.push("COALESCE(mr.type, 'consultation') as type");
                else selectParts.push("'consultation' as type");

                // file name
                if (cols.has('file_name')) selectParts.push("COALESCE(mr.file_name, '') as \"fileName\"");
                else selectParts.push("'' as \"fileName\"");

                // optional diagnosis/treatment
                selectParts.push(cols.has('diagnosis') ? 'mr.diagnosis' : "NULL as diagnosis");
                selectParts.push(cols.has('treatment') ? 'mr.treatment' : "NULL as treatment");

                selectParts.push("'completed' as status");

                let text = `SELECT ${selectParts.join(',\n            ')}\n          FROM medical_records mr\n          LEFT JOIN patients p ON mr.patient_id = p.id`;

                const values = [];
                if (patientId) {
                    text += ` WHERE mr.patient_id = $1`;
                    values.push(patientId);
                }

                text += ` ORDER BY mr.created_at DESC`;

                const result = await query(text, values);

                // Format dates as YYYY-MM-DD
                const records = result.rows.map(row => ({
                    ...row,
                    date: row.date ? new Date(row.date).toISOString().split('T')[0] : null
                }));

                res.status(200).json(records);
            } catch (error) {
                console.error('Error fetching medical records:', error);
                res.status(500).json({ error: 'Failed to fetch medical records' });
            }
            break;

        case 'POST':
            try {
                    let { patientId, patient_name, patientName, type, title, description, fileName, doctorId, doctorName } = req.body;

                if (!patientId) {
                    return res.status(400).json({ error: 'Patient ID is required' });
                }

                // Handle mock/demo/missing patient IDs
                const patientExists = await query('SELECT id, first_name, last_name FROM patients WHERE id = $1', [patientId]);

                let finalizedPatientId = patientId;
                let finalizedPatientName = 'Unknown';

                if (patientExists.rows.length === 0) {
                    console.log(`[API] POST: Patient ID ${patientId} not found. Attempting translation by name/email.`);
                    const providedPatientName = patientName || patient_name;
                    if (providedPatientName) {
                        const searchName = (providedPatientName || '').trim();
                        // Attempt name match
                        const nameCheck = await query(
                            "SELECT id, first_name, last_name FROM patients WHERE (first_name ILIKE $1 AND last_name ILIKE $2) OR (first_name || ' ' || last_name ILIKE $3) LIMIT 1",
                            [ `%${searchName.split(/\s+/)[0]}%`, `%${(searchName.split(/\s+/).slice(-1)[0] || '')}%`, `%${searchName}%` ]
                        );
                        if (nameCheck.rows.length > 0) {
                            finalizedPatientId = nameCheck.rows[0].id;
                            finalizedPatientName = `${nameCheck.rows[0].first_name} ${nameCheck.rows[0].last_name}`;
                        }
                    }
                    // Try email resolution if patientId looks like an email
                    if ((!finalizedPatientId || finalizedPatientId === patientId) && patientId && String(patientId).includes('@')) {
                        const byEmail = await query("SELECT id, first_name, last_name FROM patients WHERE LOWER(TRIM(email)) = LOWER(TRIM($1)) LIMIT 1", [patientId]);
                        if (byEmail.rows.length > 0) {
                            finalizedPatientId = byEmail.rows[0].id;
                            finalizedPatientName = `${byEmail.rows[0].first_name} ${byEmail.rows[0].last_name}`;
                        }
                    }
                } else {
                    finalizedPatientName = `${patientExists.rows[0].first_name} ${patientExists.rows[0].last_name}`;
                }

                // Verify doctor if ID is provided
                let finalizedDoctorId = doctorId;
                let finalizedDoctorName = doctorName;

                if (doctorId) {
                    const doctorCheck = await query('SELECT id, first_name, last_name FROM staff WHERE id = $1', [doctorId]);
                    if ((doctorCheck.rows.length === 0 || doctorId.startsWith('dev-')) && (doctorName || doctorId.startsWith('dev-'))) {
                        const searchName = (doctorName || doctorId).replace(/^Dr\.\s+/i, '').replace(/^dev-/i, '').trim();
                        const nameParts = searchName.split(/\s+/);
                        const firstName = nameParts[0];
                        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

                        const nameCheck = await query(
                            'SELECT id, first_name, last_name FROM staff WHERE (first_name ILIKE $1 AND last_name ILIKE $2) OR (first_name || \' \' || last_name ILIKE $3) LIMIT 1',
                            [`%${firstName}%`, `%${lastName}%`, `%${searchName}%`]
                        );

                        if (nameCheck.rows.length > 0) {
                            finalizedDoctorId = nameCheck.rows[0].id;
                            finalizedDoctorName = `Dr. ${nameCheck.rows[0].first_name} ${nameCheck.rows[0].last_name}`;
                        } else {
                            // If fallback needed for doctor as well
                            const fallbackDoctor = await query("SELECT id, first_name, last_name FROM staff WHERE role ILIKE '%doctor%' ORDER BY id ASC LIMIT 1");
                            if (fallbackDoctor.rows.length > 0) {
                                finalizedDoctorId = fallbackDoctor.rows[0].id;
                                finalizedDoctorName = `Dr. ${fallbackDoctor.rows[0].first_name} ${fallbackDoctor.rows[0].last_name}`;
                            } else {
                                finalizedDoctorId = null;
                            }
                        }
                    } else if (doctorCheck.rows.length > 0) {
                        finalizedDoctorName = `Dr. ${doctorCheck.rows[0].first_name} ${doctorCheck.rows[0].last_name}`;
                    } else {
                        // If doctor ID provided but not found, set to NULL to avoid FK violation
                        console.warn(`[API] Doctor ID ${doctorId} not found in staff table. Setting doctor_id to NULL.`);
                        finalizedDoctorId = null;
                    }
                }

                // Build INSERT dynamically based on existing columns to avoid missing-column errors
                const colsRes2 = await query("SELECT column_name, column_default, is_nullable FROM information_schema.columns WHERE table_name = 'medical_records'");
                const colsSet = new Set(colsRes2.rows.map(r => r.column_name));
                const colsMeta = new Map(colsRes2.rows.map(r => [r.column_name, { column_default: r.column_default, is_nullable: r.is_nullable }]));

                const insertCols = [];
                const placeholders = [];
                const insertValues = [];

                if (colsSet.has('id')) {
                    const meta = colsMeta.get('id');
                    const hasDefault = meta && meta.column_default !== null;
                    if (!hasDefault) {
                        insertCols.push('id');
                        placeholders.push(`$${insertValues.length + 1}`);
                        insertValues.push(randomUUID());
                    }
                }

                // patient_id is required
                if (colsSet.has('patient_id')) {
                    insertCols.push('patient_id');
                    placeholders.push(`$${insertValues.length + 1}`);
                    insertValues.push(finalizedPatientId);
                }

                if (colsSet.has('patient_name')) {
                    insertCols.push('patient_name');
                    placeholders.push(`$${insertValues.length + 1}`);
                    insertValues.push(finalizedPatientName);
                }

                if (colsSet.has('title')) {
                    insertCols.push('title');
                    placeholders.push(`$${insertValues.length + 1}`);
                    insertValues.push(title);
                }

                if (colsSet.has('type')) {
                    insertCols.push('type');
                    placeholders.push(`$${insertValues.length + 1}`);
                    insertValues.push(type || 'consultation');
                }

                if (colsSet.has('file_name')) {
                    insertCols.push('file_name');
                    placeholders.push(`$${insertValues.length + 1}`);
                    insertValues.push(fileName || '');
                }

                if (colsSet.has('notes')) {
                    insertCols.push('notes');
                    placeholders.push(`$${insertValues.length + 1}`);
                    insertValues.push(description);
                }

                if (colsSet.has('diagnosis')) {
                    const diagnosisVal = (req.body.diagnosis ?? title ?? type ?? description ?? 'Diagnosis');
                    insertCols.push('diagnosis');
                    placeholders.push(`$${insertValues.length + 1}`);
                    insertValues.push(diagnosisVal);
                }

                if (colsSet.has('treatment')) {
                    const treatmentVal = (req.body.treatment ?? '');
                    insertCols.push('treatment');
                    placeholders.push(`$${insertValues.length + 1}`);
                    insertValues.push(treatmentVal);
                }

                if (colsSet.has('doctor_id')) {
                    insertCols.push('doctor_id');
                    placeholders.push(`$${insertValues.length + 1}`);
                    insertValues.push(finalizedDoctorId);
                }

                if (colsSet.has('doctor_name')) {
                    insertCols.push('doctor_name');
                    placeholders.push(`$${insertValues.length + 1}`);
                    insertValues.push(finalizedDoctorName);
                }

                // date columns: include any NOT NULL columns without defaults; otherwise include one timestamp
                let includedDateCols = 0;
                const includeIfRequired = (col) => {
                    if (!colsSet.has(col)) return false;
                    const meta = colsMeta.get(col);
                    const nullable = String(meta?.is_nullable || '').toUpperCase() === 'YES';
                    const hasDefault = meta?.column_default !== null;
                    if (!nullable && !hasDefault) {
                        insertCols.push(col);
                        // Use CURRENT_DATE for 'date' (DATE type) else NOW()
                        const expr = col === 'date' ? 'CURRENT_DATE' : 'NOW()';
                        placeholders.push(expr);
                        includedDateCols++;
                        return true;
                    }
                    return false;
                };
                includeIfRequired('date');
                includeIfRequired('created_at');
                // If none required, include a sensible timestamp column
                if (includedDateCols === 0) {
                    if (colsSet.has('created_at')) {
                        insertCols.push('created_at');
                        placeholders.push('NOW()');
                        includedDateCols++;
                    } else if (colsSet.has('date')) {
                        insertCols.push('date');
                        placeholders.push('CURRENT_DATE');
                        includedDateCols++;
                    }
                }

                if (insertCols.length === 0) {
                    return res.status(500).json({ error: 'No writable columns found on medical_records table' });
                }

                const sqlText = `INSERT INTO medical_records (${insertCols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
                const result = await query(sqlText, insertValues);

                const newRecord = {
                    ...result.rows[0],
                    patient: finalizedPatientName,
                    patientId: result.rows[0].patient_id,
                    title: result.rows[0].title,
                    description: result.rows[0].notes,
                    type: result.rows[0].type,
                    fileName: result.rows[0].file_name,
                    date: new Date(result.rows[0].created_at || result.rows[0].date || Date.now()).toISOString().split('T')[0]
                };

                res.status(201).json(newRecord);
            } catch (error) {
                console.error('Error creating medical record:', error);
                res.status(500).json({ error: 'Failed to create medical record', details: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
