import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export const maxDuration = 30;

function extractDbName(uri: string): string | null {
  try {
    const url = new URL(uri);
    const db = url.pathname.replace(/^\//, "").split("?")[0].trim();
    return db.length > 0 ? db : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { sourceUri } = await req.json();

  if (!sourceUri) {
    return NextResponse.json({ error: "Source connection string is required." }, { status: 400 });
  }

  let client: MongoClient | null = null;

  try {
    client = new MongoClient(sourceUri);
    await client.connect();

    // If no DB name in URI, list all databases and collect all collections
    const dbName = extractDbName(sourceUri);
    const adminDb = client.db().admin();
    const dbList = dbName
      ? [dbName]
      : (await adminDb.listDatabases()).databases
          .map((d: { name: string }) => d.name)
          .filter((n: string) => !['admin', 'local', 'config'].includes(n));

    const allDatabases: { name: string; collections: number; docs: number }[] = [];

    for (const db of dbList) {
      const database = client.db(db);
      const collections = await database.listCollections().toArray();
      const filtered = collections.filter((c) => !c.name.startsWith('system.'));
      let docs = 0;
      for (const col of filtered) {
        docs += await database.collection(col.name).countDocuments();
      }
      allDatabases.push({ name: db, collections: filtered.length, docs });
    }

    return NextResponse.json({ success: true, dbName: dbList.join(', '), collections: allDatabases });
  } catch (err: unknown) {
    console.error("Preview error:", err);
    const message = err instanceof Error ? err.message : "Failed to connect.";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
