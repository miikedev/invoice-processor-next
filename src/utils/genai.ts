import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

export const genai = async (text: string) => {
    try {
        // ✅ Combine your instructions and the input text into a single prompt
        const fullPrompt = `Extract the invoice items from the following text and format them as a JSON array:\n\n---\n\n${text}`;

        // The generation config with the schema remains the same. It's perfect.
        const generationConfig = {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    items: {
                        type: "array",
                        description: "List of voucher line items",
                        items: {
                            type: "object",
                            properties: {
                                product_name: { type: "string" },
                                package_details: { type: "string" },
                                quantity: { type: "number" },
                                unit: { type: "string" },
                                price_per_unit: { type: "number" },
                                line_total: { type: "number" }
                            },
                            required: [
                                "product_name",
                                "package_details",
                                "quantity",
                                "unit",
                                "price_per_unit",
                                "line_total"
                            ]
                        }
                    },
                    total_amount: {
                        type: "number",
                        description: "Final total amount (စုစုပေါင်းကျသင့်ငွေ), MMK"
                    }
                },
                required: ["items", "total_amount"]
            }
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // ✅ Pass the combined prompt to the model
            contents: fullPrompt,
            config: generationConfig
        });

        // The response text is guaranteed to be a valid JSON string by the API
        const extractedData = JSON.parse(response.text!);
        return extractedData;

    } catch (error) {
        console.error("GenAI extraction failed:", error);
        // Re-throw the error so the calling function can handle it
        throw error;
    }
};