/**
 * extract_face_descriptor.js
 * 
 * Usage: node extract_face_descriptor.js <image_path>
 * Outputs: JSON array of 128 floats (the face descriptor) to stdout
 * Exit code 0 = success, 1 = no face found, 2 = error
 */

const path = require('path');
const fs = require('fs');

// Suppress TF warnings
process.env.TF_CPP_MIN_LOG_LEVEL = '3';

async function main() {
    const imagePath = process.argv[2];
    if (!imagePath || !fs.existsSync(imagePath)) {
        console.error(JSON.stringify({ error: 'Image file not found', path: imagePath }));
        process.exit(2);
    }

    try {
        // Load dependencies
        const tf = require('@tensorflow/tfjs-node');
        const faceapi = require('@vladmandic/face-api');
        const canvas = require('canvas');

        // Monkey-patch for Node.js environment
        const { Canvas, Image, ImageData } = canvas;
        faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

        // Load models
        const MODEL_PATH = path.join(__dirname, '..', 'public', 'models');
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

        // Load image
        const img = await canvas.loadImage(imagePath);

        // Detect face with landmarks and descriptor
        const detection = await faceapi
            .detectSingleFace(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            console.error(JSON.stringify({ error: 'No face detected in image' }));
            process.exit(1);
        }

        // Output the 128-float descriptor
        const descriptor = Array.from(detection.descriptor);
        console.log(JSON.stringify(descriptor));
        process.exit(0);

    } catch (err) {
        console.error(JSON.stringify({ error: err.message }));
        process.exit(2);
    }
}

main();
