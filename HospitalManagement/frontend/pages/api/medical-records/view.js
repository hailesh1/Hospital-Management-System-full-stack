import minioClient from '@/lib/minio';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fileName, bucketName } = req.query;

    if (!fileName) {
        return res.status(400).json({ error: 'File name is required' });
    }

    const bucket = bucketName || 'doc';

    try {
        // Generate a presigned URL valid for 1 hour (3600 seconds)
        const presignedUrl = await minioClient.presignedGetObject(bucket, fileName, 3600);
        
        // Redirect the user to the presigned URL
        res.redirect(presignedUrl);
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({ error: 'Failed to retrieve file', details: error.message });
    }
}
