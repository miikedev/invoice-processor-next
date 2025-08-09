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
    const invoices = await db.collection("vouchers").find({}).toArray();
    if (!invoices.length) throw new Error("No invoice data found");
    return serialize(invoices[0]);
}