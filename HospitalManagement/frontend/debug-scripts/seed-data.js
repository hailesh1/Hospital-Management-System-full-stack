import { query } from './lib/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function seedData() {
    try {
        console.log('Seeding sample data...');

        // Create sample patients
        const patients = [
            { firstName: 'Alem', lastName: 'Tadesse', dob: '1985-05-15', gender: 'Male', phone: '+251911234567', email: 'alem.tadesse@hms.com', bloodType: 'A+', address: 'Addis Ababa, Ethiopia' },
            { firstName: 'Metsi', lastName: 'Yohannes', dob: '1990-08-22', gender: 'Female', phone: '+251922345678', email: 'metsi.yohannes@hms.com', bloodType: 'B+', address: 'Addis Ababa, Ethiopia' },
            { firstName: 'Ahmed', lastName: 'Hassan', dob: '1978-03-10', gender: 'Male', phone: '+251933456789', email: 'ahmed.hassan@email.com', bloodType: 'O+', address: 'Dire Dawa, Ethiopia' },
            { firstName: 'Fatima', lastName: 'Mohammed', dob: '1995-11-30', gender: 'Female', phone: '+251944567890', email: 'fatima.m@email.com', bloodType: 'AB+', address: 'Mekelle, Ethiopia' },
            { firstName: 'Daniel', lastName: 'Tesfaye', dob: '1982-07-18', gender: 'Male', phone: '+251955678901', email: 'daniel.t@email.com', bloodType: 'A-', address: 'Bahir Dar, Ethiopia' },
        ];

        for (const p of patients) {
            await query(
                `INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, blood_type, address, status, registered_date) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Active', CURRENT_DATE)`,
                [p.firstName, p.lastName, p.dob, p.gender, p.phone, p.email, p.bloodType, p.address]
            );
        }

        console.log(`\n✓ Created ${patients.length} sample patients`);
        console.log('✓ All patients have status "Active"');
        console.log('✓ Patients can now be seen in the receptionist dashboard\n');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error.message);
        process.exit(1);
    }
}

seedData();
