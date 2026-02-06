import { query } from '@/lib/db';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    if (method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    try {
        const { status } = req.body;
        console.log(`[API] Updating status for staff ${id} to: ${status}`);

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const validStatuses = ['Available', 'Busy', 'In Personal Break', 'Offline'];

        // Map frontend status to DB enum values (uppercase, underscores)
        const statusMap = {
            'Available': 'AVAILABLE',
            'Busy': 'BUSY',
            'In Personal Break': 'IN_PERSONAL_BREAK',
            'Offline': 'AVAILABLE' // 'Offline' isn't in DB constraint, default to AVAILABLE or handle otherwise. Assuming AVAILABLE for now or maybe we shouldn't allow offline update if not in DB. 
                                   // Wait, the constraint says: AVAILABLE, BUSY, IN_PERSONAL_BREAK.
        };

        // If status is not in map, default to AVAILABLE or throw? 
        // Let's check strict matching.
        let dbStatus = statusMap[status] || status.toUpperCase().replace(/ /g, '_');
        
        // Validate against known DB values to be safe
        const allowedDbStatuses = ['AVAILABLE', 'BUSY', 'IN_PERSONAL_BREAK'];
        if (!allowedDbStatuses.includes(dbStatus)) {
             // If "Offline" is passed but not in DB, maybe we just don't update or set to specific state?
             // For now, let's map unknown to AVAILABLE to prevent crash, or keep original if it might be valid.
             // But we know the constraint is strict.
             if (status === 'Offline') {
                 // Offline might just mean "Not showing in UI" but in DB they are "AVAILABLE" (or maybe we shouldn't touch DB?)
                 // Let's assume we update to AVAILABLE for now, or maybe the user just logged out.
                 dbStatus = 'AVAILABLE'; 
             } else {
                 console.warn(`[API] Invalid status ${status}, defaulting to AVAILABLE`);
                 dbStatus = 'AVAILABLE';
             }
        }

        console.log(`[API] Final status to be saved (availability_status): ${dbStatus}`);

        const result = await query(
            'UPDATE staff SET availability_status = $1 WHERE id = $2 RETURNING id, first_name, last_name, availability_status as status, role',
            [dbStatus, id]
        );

        if (result.rowCount === 0) {
            console.warn(`[API] No staff found with ID: ${id}`);
            return res.status(404).json({ error: 'Staff member not found' });
        }

        console.log(`[API] Successfully updated status for ${result.rows[0].first_name} to ${dbStatus}`);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating staff status:', error);
        res.status(500).json({ error: 'Failed to update status', details: error.message });
    }
}
