import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body as { message: string };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    return NextResponse.json({
      reply: response.text,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "AI response failed" },
      { status: 500 }
    );
  }
}
