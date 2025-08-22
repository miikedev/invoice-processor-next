// db.ts
import { MongoClient, Db } from "mongodb";
import { revalidateTag, unstable_cache } from "next/cache";

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

// Get all invoices for a user (optionally filter by date)
export const getAllInvoices = async (userId: string, date?: Date | null) => {
    const db = await connectToDB();

    // If date is null, use current date (today)
    const targetDate = date ? new Date(date) : new Date();

    const startDate = new Date(targetDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);

    const filter: Record<string, any> = {
        created_at: { $gte: startDate, $lte: endDate },
    };

    const documents = await db
        .collection(`vouchers-${userId}`)
        .find(filter)
        .sort({ _id: -1 }) // newest first
        .toArray();

    return documents.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
        created_at: doc.created_at.toISOString(),
    }));
};

export async function insertInvoiceData(item: any) {
    try {
        console.log("payload in insert invoice data", item);

        // Connect to DB
        const db = await connectToDB();

        // Directly insert — MongoDB auto-creates the collection if it doesn't exist
        const result = await db.collection(`vouchers-${item.user_id}`).insertOne({
            items: item.items,
            total_amount: item.total_amount,
            user_id: item.user_id,
            created_at: new Date(),
        });

        revalidateTag("invoice");

        return { success: true, insertedId: result.insertedId };
    } catch (error: any) {
        console.error("Insert error:", error.message || error);
        return { success: false, error: error.message || error };
    }
}