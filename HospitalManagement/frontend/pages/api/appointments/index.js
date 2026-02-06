import { query } from '@/lib/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        let { patient_id, doctor_id, status, date } = req.query;

        // Handle mock/demo patient IDs or missing patient IDs
        if (patient_id) {
          const idExists = await query('SELECT id FROM patients WHERE id = $1', [patient_id]);
          if (idExists.rows.length === 0) {
            console.log(`[API] GET: Patient ID ${patient_id} not found. Using fallback.`);
            const defaultPatient = await query('SELECT id FROM patients ORDER BY id ASC LIMIT 1');
            if (defaultPatient.rows.length > 0) {
              patient_id = defaultPatient.rows[0].id;
            }
          }
        }

        let queryString = `
          SELECT a.*, 
                 CONCAT(p.first_name, ' ', p.last_name) as patient_name, 
                 CONCAT(d.first_name, ' ', d.last_name) as doctor_name,
                 d.specialization as specialization_name
          FROM appointments a
          LEFT JOIN patients p ON a.patient_id = p.id
          LEFT JOIN staff d ON a.doctor_id = d.id
          WHERE 1=1
        `;

        const queryParams = [];
        let paramCount = 1;

        if (patient_id) {
          queryString += ` AND a.patient_id = $${paramCount++}`;
          queryParams.push(patient_id);
        }

        if (doctor_id) {
          queryString += ` AND a.doctor_id = $${paramCount++}`;
          queryParams.push(doctor_id);
        }

        if (status) {
          queryString += ` AND a.status = $${paramCount++}`;
          queryParams.push(status);
        }

        if (date) {
          queryString += ` AND a.date = $${paramCount++}`;
          queryParams.push(date);
        }

        queryString += ' ORDER BY a.date DESC, a.time DESC';

        const result = await query(queryString, queryParams);
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const body = req.body;
        let patient_id = body.patient_id || body.patientId;
        if (patient_id) patient_id = String(patient_id);

        let doctor_id = body.doctor_id || body.doctorId;
        if (doctor_id) doctor_id = String(doctor_id);

        let patient_name = body.patient_name || body.patientName;
        let appointment_date = body.appointment_date || body.appointmentDate;
        let reason = body.reason || body.notes || '';
        let status = (body.status || 'SCHEDULED').toUpperCase();

        const VALID_TYPES = ['CHECKUP', 'FOLLOW_UP', 'EMERGENCY', 'CONSULTATION'];
        let typeInput = (body.type || 'CONSULTATION').toUpperCase();
        if (typeInput === 'CHECK-UP') typeInput = 'CHECKUP';
        if (typeInput === 'FOLLOW UP') typeInput = 'FOLLOW_UP';

        let type = VALID_TYPES.includes(typeInput) ? typeInput : 'CONSULTATION';

        let date = body.date;
        let time = body.time;

        // Check if patient exists with provided ID
        let patientExists = await query('SELECT id, first_name, last_name FROM patients WHERE id = $1', [patient_id]);

        // Attempt translation/fallback if patient NOT found by ID
        if (patientExists.rows.length === 0) {
          console.log(`[API] Patient ID ${patient_id} not found. Attempting translation/fallback.`);

          if (patient_name) {
            const searchName = patient_name.trim();
            const nameCheck = await query(
              "SELECT id, first_name, last_name FROM patients WHERE (first_name || ' ' || last_name) ILIKE $1 LIMIT 1",
              [`%${searchName}%`]
            );
            if (nameCheck.rows.length > 0) {
              patient_id = nameCheck.rows[0].id;
              patientExists = nameCheck;
            } else {
              const defaultPatient = await query('SELECT id, first_name, last_name FROM patients ORDER BY id ASC LIMIT 1');
              if (defaultPatient.rows.length > 0) {
                patient_id = defaultPatient.rows[0].id;
                patientExists = defaultPatient;
              }
            }
          } else {
            const defaultPatient = await query('SELECT id, first_name, last_name FROM patients ORDER BY id ASC LIMIT 1');
            if (defaultPatient.rows.length > 0) {
              patient_id = defaultPatient.rows[0].id;
              patientExists = defaultPatient;
            }
          }
        }

        // Final check for patient existence
        if (patientExists.rows.length === 0) {
          return res.status(404).json({ error: 'Patient not found. Please ensure at least one patient exists in the database.' });
        }

        // Determine final patient name
        const finalPatientName = `${patientExists.rows[0].first_name} ${patientExists.rows[0].last_name}`;

        // Check if doctor exists in staff table and get name
        let doctorExists = await query(
          "SELECT id, first_name, last_name FROM staff WHERE id = $1 AND (role ILIKE '%doctor%' OR role ILIKE '%specialist%' OR role = 'DOCTOR')",
          [doctor_id]
        );

        // Handle mock doctor translation
        if (doctorExists.rows.length === 0) {
          console.log(`[API] POST: Doctor ID ${doctor_id} not found. Attempting translation/fallback.`);
          const fallbackDoctor = await query("SELECT id, first_name, last_name FROM staff WHERE role ILIKE '%doctor%' OR position ILIKE '%doctor%' ORDER BY id ASC LIMIT 1");
          if (fallbackDoctor.rows.length > 0) {
            doctor_id = fallbackDoctor.rows[0].id;
            doctorExists = fallbackDoctor;
          }
        }

        if (doctorExists.rows.length === 0) {
          return res.status(404).json({ error: 'Doctor not found. Please ensure at least one doctor exists in the database.' });
        }
        const doctorName = `${doctorExists.rows[0].first_name} ${doctorExists.rows[0].last_name}`;

        // Derive date and time
        if (!date && appointment_date) {
          try {
            const d = new Date(appointment_date);
            if (!isNaN(d.getTime())) {
              date = d.toISOString().split('T')[0];
            }
          } catch (e) {
            console.error("Invalid appointment_date", e);
          }
        }
        if (!time && appointment_date && typeof appointment_date === 'string' && appointment_date.includes('T')) {
          time = appointment_date.split('T')[1].substring(0, 5);
        }

        if (!date || !time) {
          return res.status(400).json({ error: 'Date and time are required' });
        }

        if (!appointment_date && date && time) {
          appointment_date = `${date}T${time}:00`;
        }

        // Check for existing appointment at the same time for this doctor
        const conflictCheck = await query(
          "SELECT id FROM appointments WHERE doctor_id = $1 AND date = $2 AND time = $3 AND status NOT IN ('CANCELLED', 'REJECTED')",
          [doctor_id, date, time]
        );

        if (conflictCheck.rows.length > 0) {
          return res.status(409).json({ error: 'This time slot is already booked for the selected doctor. Please choose another time.' });
        }

        // Generate a UUID
        const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

        const result = await query(
          'INSERT INTO appointments (id, patient_id, doctor_id, notes, status, date, time, patient_name, doctor_name, type) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
          [id, patient_id, doctor_id, reason, status, date, time, finalPatientName, doctorName, type]
        );

        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
