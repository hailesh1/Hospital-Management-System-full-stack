import { query } from '@/lib/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await query(`
          SELECT 
            id, 
            first_name, 
            last_name, 
            email, 
            phone, 
            gender, 
            date_of_birth as dob, 
            address, 
            blood_type as "bloodType",
            EXTRACT(YEAR FROM AGE(date_of_birth))::int as age,
            status,
            to_char(registered_date, 'YYYY-MM-DD') as "lastVisit",
            registered_date,
            (first_name || ' ' || last_name) as name,
            created_by
          FROM patients 
          ORDER BY id ASC
        `);
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const { firstName, lastName, dateOfBirth, gender, address, phone, email, bloodType, emergencyContact, createdBy } = req.body;
        console.log('--- CREATING PATIENT ---', { firstName, lastName, email, createdBy });

        // Map frontend fields to DB fields
        // dateOfBirth -> $3
        // emergencyContact object -> separate fields
        const emergencyName = emergencyContact?.name || null;
        const emergencyPhone = emergencyContact?.phone || null;

        const id = req.body.id || null;

        // Use UPSERT logic (ON CONFLICT DO UPDATE) if an ID is provided
        let sql, params;
        if (id) {
          // --- BEGIN SYNC LOGIC ---
          // Use case-insensitive search and handle potential whitespace
          const trimmedEmail = email?.trim().toLowerCase();

          if (trimmedEmail) {
            const existingByEmail = await query('SELECT id FROM patients WHERE LOWER(TRIM(email)) = $1', [trimmedEmail]);

            if (existingByEmail.rows.length > 0 && existingByEmail.rows[0].id !== id) {
              const oldId = existingByEmail.rows[0].id;
              console.log(`[API] Sync: Merging data from old ID ${oldId} to new ID ${id} (email: ${trimmedEmail})`);

              try {
                // Use a transaction for atomic ID migration
                await query('BEGIN');

                // Update related records in all tables found in audit
                const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices', 'insurance_claims', 'vital_signs'];
                for (const table of tables) {
                  try {
                    await query(`UPDATE ${table} SET patient_id = $1 WHERE patient_id = $2`, [id, oldId]);
                  } catch (e) {
                    console.warn(`[API] Sync: Table ${table} update skipped or failed: ${e.message}`);
                  }
                }

                // Update the patient record including name to match session
                await query('UPDATE patients SET id = $1, first_name = $2, last_name = $3 WHERE id = $4', [id, firstName, lastName, oldId]);

                await query('COMMIT');
                console.log(`[API] Sync: Atomic ID migration complete for ${trimmedEmail} (New ID: ${id})`);
                return res.status(200).json({ message: 'Patient synced and record updated', id });
              } catch (syncErr) {
                await query('ROLLBACK');
                console.error('[API] Sync Transaction Failed:', syncErr);
                // Propagate error to prevent creating/maintaining duplicate records
                return res.status(500).json({ error: 'Failed to synchronize patient record', details: syncErr.message });
              }
            }
          }
          // --- END SYNC LOGIC ---

          // Defaults for missing fields to prevent NOT NULL constraint violations
          const defaultDOB = dateOfBirth || '1990-01-01';
          const defaultGender = (gender || 'MALE').toUpperCase();
          const defaultPhone = phone || '000-000-0000';

          sql = `
            INSERT INTO patients (id, first_name, last_name, date_of_birth, gender, address, phone, email, blood_type, emergency_name, emergency_phone, registered_date, status, created_by) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_DATE, $12, $13)
            ON CONFLICT (id) DO UPDATE SET 
              first_name = EXCLUDED.first_name,
              last_name = EXCLUDED.last_name,
              email = EXCLUDED.email
            RETURNING *, (first_name || ' ' || last_name) as name, date_of_birth as dob, blood_type as "bloodType"
          `;
          params = [id, firstName, lastName, defaultDOB, defaultGender, address, defaultPhone, email, bloodType, emergencyName, emergencyPhone, 'ACTIVE', createdBy];
        }
        else {
          const defaultDOB = dateOfBirth || '1990-01-01';
          const defaultGender = (gender || 'MALE').toUpperCase();
          const defaultPhone = phone || '000-000-0000';

          sql = `
            INSERT INTO patients (id, first_name, last_name, date_of_birth, gender, address, phone, email, blood_type, emergency_name, emergency_phone, registered_date, status, created_by) 
            VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE, $11, $12) 
            RETURNING *, (first_name || ' ' || last_name) as name, date_of_birth as dob, blood_type as "bloodType"
          `;
          params = [firstName, lastName, defaultDOB, defaultGender, address, defaultPhone, email, bloodType, emergencyName, emergencyPhone, 'ACTIVE', createdBy];
        }

        const result = await query(sql, params);
        console.log('Patient created successfully:', result.rows[0].id);
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error in POST /api/patients:', {
          message: error.message,
          code: error.code,
          detail: error.detail,
          body: req.body
        });
        res.status(500).json({ error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'Patient ID is required' });
        }

        // Start a transaction or just delete sequentially
        // For development robustness, we'll delete from all related tables
        await query('DELETE FROM appointments WHERE patient_id = $1', [id]);
        await query('DELETE FROM medical_records WHERE patient_id = $1', [id]);
        await query('DELETE FROM lab_tests WHERE patient_id = $1', [id]);
        await query('DELETE FROM prescriptions WHERE patient_id = $1', [id]);
        await query('DELETE FROM invoices WHERE patient_id = $1', [id]);

        const result = await query('DELETE FROM patients WHERE id = $1', [id]);

        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Patient not found' });
        }

        res.status(200).json({ message: 'Patient and related records deleted successfully' });
      } catch (error) {
        console.error('Error in DELETE /api/patients:', error);
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
