// db.ts
import { MongoClient, Db } from "mongodb";

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

// Converts Mongo ObjectIDs and Dates to plain JSON-safe values
function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (key, value) => {
            if (value && typeof value === "object" && value._bsontype === "ObjectID") {
                return value.toString();
            }
            if (value instanceof Date) {
                return value.toISOString();
            }
            return value;
        })
    );
}

export async function getInvoiceData() {
    const db = await connectToDB();
    // Sort by the automatically generated _id in descending order and get the first one
    const last_item = await db.collection("vouchers").findOne({}, { sort: { _id: -1 } });

    if (!last_item) throw new Error("No invoice data found");
    return serialize(last_item);
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

        console.log("Insert success:", result.insertedId);

        return { success: true, insertedId: result.insertedId };
    } catch (error: any) {
        console.error("Insert error:", error.message || error);
        return { success: false, error: error.message || error };
    }
}