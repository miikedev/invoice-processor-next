// import vision from '@google-cloud/vision';
// import path from 'path';

// // Path to your service account key
// const keyPath = path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);

// // Create client
// const client = new vision.ImageAnnotatorClient({ keyFilename: keyPath });

// export async function POST(req) {
//     try {
//         const { imageUrl } = await req.json();

//         // Analyze image
//         const [result] = await client.labelDetection(imageUrl);

//         return new Response(
//             JSON.stringify({
//                 labels: result.labelAnnotations.map(label => ({
//                     description: label.description,
//                     score: label.score,
//                 })),
//             }),
//             { status: 200 }
//         );

//     } catch (error) {
//         return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//     }
// }