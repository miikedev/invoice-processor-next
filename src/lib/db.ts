// db.ts
import { MongoClient, Db } from "mongodb";

const uri: string | undefined = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db: Db | null = null;

export async function connectToDB(): Promise<Db> {
    if (!db) {
        await client.connect();
        db = client.db("test"); // ✅ Replace with your actual DB name
    }
    return db;
}