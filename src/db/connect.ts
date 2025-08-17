// db.ts
import { MongoClient, Db } from "mongodb";
import { revalidateTag } from "next/cache";

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables");
}

const client = new MongoClient(uri);

let db: Db | null = null;

export async function connectToDB(): Promise<Db> {
    if (!db) {
        await client.connect();
        db = client.db("test"); // ✅ Replace with your actual DB name
    }
    return db;
}

export async function insertInvoiceData(item: any) {
    try {
        console.log('payload in insert invoice data', item);

        // Connect to DB
        const db = await connectToDB();

        // Insert one document
        const result = await db.collection("vouchers").insertOne({
            items: item.items,
            total_amount: item.total_amount,
            created_at: new Date() // better to store a Date instead of a number
        });

        revalidateTag("invoice");

        return { success: true, insertedId: result.insertedId };
    } catch (error: any) {
        console.error("Insert error:", error.message || error);
        return { success: false, error: error.message || error };
    }
}