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
  const { destinationUri, sourceDbNames } = await req.json();

  if (!destinationUri || !sourceDbNames) {
    return NextResponse.json({ error: "Destination URI and source database names are required." }, { status: 400 });
  }

  // Trim the destination URI
  const trimmedDestinationUri = destinationUri.trim();

  let client: MongoClient | null = null;

  try {
    client = new MongoClient(trimmedDestinationUri, {
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

    const adminDb = client.db().admin();
    const destDbs = (await adminDb.listDatabases()).databases
      .map((d: { name: string }) => d.name)
      .filter((n: string) => !['admin', 'local', 'config'].includes(n));

    const existingDbs = sourceDbNames.filter((dbName: string) => destDbs.includes(dbName));

    return NextResponse.json({ success: true, existingDbs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to connect.";
    return NextResponse.json({ error: `Destination connection failed: ${message}` }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}