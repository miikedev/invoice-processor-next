const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

const processInvoice = async (fileName) => {
    console.log(`Processing invoice: ${fileName}`);
    try {
        // 2. Use the single, shared client instance
        const [result] = await client.textDetection(fileName);

        if (!result.textAnnotations || result.textAnnotations.length === 0) {
            throw new Error('No text found in the image.');
        }

        const detections = result.textAnnotations;
        const ocrText = detections[0].description;

        // 3. Return the extracted text
        return ocrText;

    } catch (error) {
        console.error('Google Vision API Error:', error);
        // 4. Re-throw the original error to be caught by the route handler
        throw error;
    }
};

export const processInvoiceTest = async (imageUrl: string) => {
    console.log(`Processing invoice: ${imageUrl}`);
    try {
        // 2. Use the single, shared client instance
        const [result] = await client.textDetection(imageUrl);

        if (!result.textAnnotations || result.textAnnotations.length === 0) {
            throw new Error('No text found in the image.');
        }

        const detections = result.textAnnotations;
        const ocrText = detections[0].description;

        // 3. Return the extracted text
        return ocrText;

    } catch (error) {
        console.error('Google Vision API Error:', error);
        // 4. Re-throw the original error to be caught by the route handler
        throw error;
    }
}