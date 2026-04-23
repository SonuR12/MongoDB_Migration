import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;

let client: MongoClient | null = null;

async function getClient() {
  if (!client) client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client;
}

export async function GET(req: NextRequest) {
  const increment = new URL(req.url).searchParams.get("increment") === "true";
  try {
    const db = (await getClient()).db();
    const col = db.collection("visitors");
    if (increment) {
      await col.updateOne({}, { $inc: { count: 1 } }, { upsert: true });
    }
    const doc = await col.findOne({});
    return NextResponse.json({ count: doc?.count ?? 1 });
  } catch {
    return NextResponse.json({ count: "1000+" });
  }
}
