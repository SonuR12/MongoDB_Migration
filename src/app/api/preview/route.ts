import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export const maxDuration = 60;

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

  // Trim the source URI
  const trimmedSourceUri = sourceUri.trim();

  let client: MongoClient | null = null;

  try {
    client = new MongoClient(trimmedSourceUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      retryWrites: true,
      retryReads: true,
    });
    await client.connect();

    // If no DB name in URI, list all databases and collect all collections
    const dbName = extractDbName(trimmedSourceUri);
    const adminDb = client.db().admin();
    const dbList = dbName
      ? [dbName]
      : (await adminDb.listDatabases()).databases
          .map((d: { name: string }) => d.name)
          .filter((n: string) => !['admin', 'local', 'config'].includes(n));

    const allDatabases: { name: string; collections: number; docs: number }[] = [];

    // Process databases in parallel with limited concurrency
    const processDatabase = async (db: string) => {
      const database = client!.db(db);
      const collections = await database.listCollections().toArray();
      const filtered = collections.filter((c) => !c.name.startsWith('system.'));
      
      // Use estimatedDocumentCount for better performance
      let docs = 0;
      const docCountPromises = filtered.map(async (col) => {
        try {
          // estimatedDocumentCount is much faster than countDocuments
          return await database.collection(col.name).estimatedDocumentCount();
        } catch {
          // Fallback to countDocuments if estimatedDocumentCount fails
          try {
            return await database.collection(col.name).countDocuments({}, { maxTimeMS: 10000 });
          } catch {
            return 0; // If both fail, return 0
          }
        }
      });
      
      const docCounts = await Promise.all(docCountPromises);
      docs = docCounts.reduce((sum, count) => sum + count, 0);
      
      return { name: db, collections: filtered.length, docs };
    };

    // Process up to 3 databases concurrently
    const batchSize = 3;
    for (let i = 0; i < dbList.length; i += batchSize) {
      const batch = dbList.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(processDatabase));
      allDatabases.push(...results);
    }

    return NextResponse.json({ success: true, dbName: dbList.join(', '), collections: allDatabases });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to connect.";
    const errorMessage = `Source connection failed: ${message}`;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
