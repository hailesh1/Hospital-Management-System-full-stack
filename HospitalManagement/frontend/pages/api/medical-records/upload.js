import { IncomingForm } from 'formidable';
import fs from 'fs';
import minioClient from '@/lib/minio';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            return res.status(500).json({ error: 'Error parsing form data' });
        }

        const file = files.file?.[0] || files.file; // formidable v3 can return array
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const bucketName = 'doc';
        const objectName = `${Date.now()}-${file.originalFilename}`;
        const filePath = file.filepath;

        try {
            const bucketExists = await minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName, 'us-east-1');
            }

            const fileStream = fs.createReadStream(filePath);
            const metaData = {
                'Content-Type': file.mimetype,
            };

            await minioClient.putObject(bucketName, objectName, fileStream, file.size, metaData);

            // Clean up temp file
            // fs.unlinkSync(filePath); // Optional: formidable might handle this or temp dir cleanup

            res.status(200).json({
                fileName: objectName,
                url: `http://localhost:9000/${bucketName}/${objectName}`,
                bucket: bucketName
            });
        } catch (error) {
            console.error('MinIO upload error:', error);
            res.status(500).json({ error: 'Failed to upload to storage' });
        }
    });
}
