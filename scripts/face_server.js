import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import tf from '@tensorflow/tfjs-node';
import faceapi from '@vladmandic/face-api';
import canvas from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Suppress TF logs
process.env.TF_CPP_MIN_LOG_LEVEL = '3';

const app = express();
app.use(express.json({ limit: '50mb' }));

// Express JSON syntax error handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('JSON SyntaxError:', err.message);
        return res.status(400).json({ error: 'Invalid JSON body: ' + err.message });
    }
    next();
});

// Patch face-api for Node env
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = path.join(__dirname, '..', 'public', 'models');

// Load models at startup
console.log('Loading face-api models from:', MODEL_PATH);
await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
console.log('Models loaded successfully.');

app.post('/api/extract', async (req, res) => {
    try {
        let { image } = req.body || {};
        if (!image) {
            return res.status(400).json({ error: 'Missing image field' });
        }

        // Clean base64 string
        image = image.replace(/^data:image\/\w+;base64,/, '').replace(/[\r\n\s\\]/g, '');

        const tempPath = path.join(__dirname, `temp_face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`);
        const buffer = Buffer.from(image, 'base64');
        fs.writeFileSync(tempPath, buffer);

        try {
            const img = await canvas.loadImage(tempPath);
            const detection = await faceapi
                .detectSingleFace(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 }))
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                return res.status(422).json({ error: 'No face detected in image' });
            }

            const descriptor = Array.from(detection.descriptor);
            return res.json({ descriptor });
        } finally {
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        }
    } catch (err) {
        console.error('Extraction error:', err);
        return res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Face descriptor microservice listening on port ${PORT}`);
});