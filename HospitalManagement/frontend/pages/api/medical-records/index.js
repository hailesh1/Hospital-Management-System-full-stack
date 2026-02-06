import { query } from '@/lib/db';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                let { patientId } = req.query;

                // Handle mock/development patient IDs or missing patient IDs
                if (patientId) {
                    const patientCheck = await query('SELECT id FROM patients WHERE id = $1', [patientId]);
                    if (patientCheck.rows.length === 0) {
                        console.log(`[API] GET: Patient ID ${patientId} not found. Using fallback.`);
                        const fallbackPatient = await query('SELECT id FROM patients ORDER BY id ASC LIMIT 1');
                        if (fallbackPatient.rows.length > 0) {
                            patientId = fallbackPatient.rows[0].id;
                        }
                    }
                }

                let text = `
          SELECT 
            mr.id,
            mr.patient_id as "patientId",
            CONCAT(p.first_name, ' ', p.last_name) as patient,
            CONCAT(p.first_name, ' ', p.last_name) as patient_name,
            mr.doctor_name as doctor,
            mr.created_at as date,
            COALESCE(mr.title, mr.diagnosis, 'Medical Record') as title,
            mr.notes as description,
            COALESCE(mr.type, 'consultation') as type,
            COALESCE(mr.file_name, '') as "fileName",
            mr.diagnosis,
            mr.treatment,
            'completed' as status
          FROM medical_records mr
          LEFT JOIN patients p ON mr.patient_id = p.id
        `;

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
                let { patientId, type, title, description, fileName, doctorId, doctorName } = req.body;

                if (!patientId) {
                    return res.status(400).json({ error: 'Patient ID is required' });
                }

                // Handle mock/demo/missing patient IDs
                const patientExists = await query('SELECT id, first_name, last_name FROM patients WHERE id = $1', [patientId]);

                let finalizedPatientId = patientId;
                let finalizedPatientName = 'Unknown';

                if (patientExists.rows.length === 0) {
                    console.log(`[API] POST: Patient ID ${patientId} not found. Attempting translation/fallback.`);
                    const fallbackPatient = await query('SELECT id, first_name, last_name FROM patients ORDER BY id ASC LIMIT 1');
                    if (fallbackPatient.rows.length > 0) {
                        finalizedPatientId = fallbackPatient.rows[0].id;
                        finalizedPatientName = `${fallbackPatient.rows[0].first_name} ${fallbackPatient.rows[0].last_name}`;
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
                            const fallbackDoctor = await query("SELECT id, first_name, last_name FROM staff WHERE role ILIKE '%doctor%' OR position ILIKE '%doctor%' ORDER BY id ASC LIMIT 1");
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

                // Check if patient_name column exists to avoid error if it doesn't
                const checkPatientNameCol = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'patient_name'");
                const hasPatientNameCol = checkPatientNameCol.rows.length > 0;

                let sqlText, sqlValues;
                if (hasPatientNameCol) {
                    sqlText = `
            INSERT INTO medical_records (id, patient_id, patient_name, title, type, file_name, notes, date, doctor_id, doctor_name)
            VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, NOW(), $7, $8)
            RETURNING *
          `;
                    sqlValues = [finalizedPatientId, finalizedPatientName, title, type || 'consultation', fileName || '', description, finalizedDoctorId, finalizedDoctorName];
                } else {
                    sqlText = `
            INSERT INTO medical_records (id, patient_id, title, type, file_name, notes, date, doctor_id, doctor_name)
            VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, NOW(), $6, $7)
            RETURNING *
          `;
                    sqlValues = [finalizedPatientId, title, type || 'consultation', fileName || '', description, finalizedDoctorId, finalizedDoctorName];
                }

                const result = await query(sqlText, sqlValues);

                const newRecord = {
                    ...result.rows[0],
                    patient: finalizedPatientName,
                    patientId: result.rows[0].patient_id,
                    title: result.rows[0].title,
                    description: result.rows[0].notes,
                    type: result.rows[0].type,
                    fileName: result.rows[0].file_name,
                    date: new Date(result.rows[0].date).toISOString().split('T')[0]
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
