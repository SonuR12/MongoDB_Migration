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
  const { sourceUri, destinationUri, selectedDbs } = await req.json();

  if (!sourceUri || !destinationUri) {
    return NextResponse.json({ error: "Both connection strings are required." }, { status: 400 });
  }

  // Trim both URIs
  const trimmedSourceUri = sourceUri.trim();
  const trimmedDestinationUri = destinationUri.trim();

  const sourceDbName = extractDbName(trimmedSourceUri);
  const destDbName = extractDbName(trimmedDestinationUri);

  let source: MongoClient | null = null;
  let dest: MongoClient | null = null;

  try {
    source = new MongoClient(trimmedSourceUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      retryWrites: true,
      retryReads: true,
      maxIdleTimeMS: 30000,
      heartbeatFrequencyMS: 10000,
    });
    dest = new MongoClient(trimmedDestinationUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      retryWrites: true,
      retryReads: true,
      maxIdleTimeMS: 30000,
      heartbeatFrequencyMS: 10000,
    });
    
    try {
      await source.connect();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to connect.";
      throw new Error(`Source connection failed: ${message}`);
    }
    
    try {
      await dest.connect();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to connect.";
      throw new Error(`Destination connection failed: ${message}`);
    }

    const adminDb = source.db().admin();
    const allDbs = sourceDbName
      ? [sourceDbName]
      : (await adminDb.listDatabases()).databases
          .map((d: { name: string }) => d.name)
          .filter((n: string) => !['admin', 'local', 'config'].includes(n));

    const dbList = selectedDbs?.length
      ? allDbs.filter((db: string) => selectedDbs.includes(db))
      : allDbs;
    const results: { collection: string; docsMigrated: number }[] = [];

    for (const db of dbList) {
      const sourceDb = source.db(db);
      const destDb = dest.db(destDbName ?? db);
      const collections = await sourceDb.listCollections().toArray();

      for (const col of collections) {
        const name = col.name;
        if (name.startsWith('system.')) continue;
        const docs = await sourceDb.collection(name).find({}).toArray();
        if (docs.length > 0) {
          await destDb.collection(name).deleteMany({});
          await destDb.collection(name).insertMany(docs, { ordered: false });
        }
        results.push({ collection: `${db}/${name}`, docsMigrated: docs.length });
      }
    }

    return NextResponse.json({ success: true, results, sourceDb: dbList.join(', '), destDb: destDbName ?? dbList.join(', ') });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Migration failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (source) await source.close();
    if (dest) await dest.close();
  }
}
