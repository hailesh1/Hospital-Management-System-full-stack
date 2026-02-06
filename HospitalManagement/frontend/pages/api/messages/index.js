import { query } from '@/lib/db';

export default async function handler(req, res) {
    const { method } = req;
    const currentUserId = 'receptionist-1'; // Mock logged in user

    switch (method) {
        case 'GET':
            if (req.query.type === 'recipients') {
                try {
                    // Fetch potential recipients based on role
                    const role = req.query.role;
                    let queryStr = '';

                    if (role === 'DOCTOR') queryStr = "SELECT id, first_name || ' ' || last_name as label FROM staff WHERE role ILIKE '%doctor%' OR role ILIKE '%specialist%' OR role = 'DOCTOR'";
                    else if (role === 'PATIENT') queryStr = "SELECT id, first_name || ' ' || last_name as label FROM patients";
                    else queryStr = "SELECT id, first_name || ' ' || last_name as label FROM staff WHERE NOT (role ILIKE '%doctor%' OR role ILIKE '%specialist%' OR role = 'DOCTOR')";

                    const result = await query(queryStr);
                    return res.status(200).json(result.rows);
                } catch (error) {
                    return res.status(500).json({ error: error.message });
                }
            }

            try {
                // Fetch messages for current user
                const result = await query(`
                    SELECT m.*, 
                    CASE 
                        WHEN m.sender_id = $1 THEN 'Me'
                        ELSE 'Sender' -- Ideally join with users table to get names
                    END as sender_name
                    FROM messages m
                    WHERE receiver_id = $1 OR sender_id = $1
                    ORDER BY m.created_at DESC
                `, [currentUserId]);
                res.status(200).json(result.rows);
            } catch (error) {
                console.error('Error fetching messages:', error);
                res.status(500).json({ error: 'Failed to fetch messages' });
            }
            break;

        case 'POST':
            try {
                const { receiverId, receiverRole, content } = req.body;

                if (!receiverId || !content) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const result = await query(
                    `INSERT INTO messages (id, sender_id, receiver_id, receiver_role, content, created_at) 
                     VALUES (uuid_generate_v4(), $1, $2, $3, $4, NOW()) 
                     RETURNING *`,
                    [currentUserId, receiverId, receiverRole, content]
                );

                res.status(201).json(result.rows[0]);
            } catch (error) {
                console.error('Error sending message:', error);
                res.status(500).json({ error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
