import { NextResponse } from "next/server";
import { analyzeSegment } from "@/lib/analyzer/analyzeSegment";
import { segmentSchema } from "@/lib/validation/segmentSchema";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = segmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid payload",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(analyzeSegment(parsed.data));
}
