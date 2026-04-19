import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

async function getCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("emotion_history");
}

// POST /api/emotions  — save emotion event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const col = await getCollection();
    const doc = {
      emotion: body.emotion || "neutral",
      confidence: body.confidence || 0,
      all_emotions: body.all_emotions || {},
      timestamp: body.timestamp || new Date().toISOString(),
      savedAt: new Date(),
    };
    const result = await col.insertOne(doc);
    return NextResponse.json({ ok: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (err) {
    console.error("MongoDB save error:", err);
    return NextResponse.json({ ok: false, error: "DB unavailable" }, { status: 503 });
  }
}

// GET /api/emotions  — fetch last 100 events
export async function GET() {
  try {
    const col = await getCollection();
    const docs = await col
      .find({}, { projection: { _id: 0 } })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    return NextResponse.json(docs);
  } catch {
    return NextResponse.json([]);
  }
}
