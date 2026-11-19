import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI is not configured. Add your API key." },
        { status: 503 }
      );
    }

    const { message, products } = await req.json();

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions: `
        You are ECORA AI, a friendly sustainable shopping assistant.

        Help customers discover eco-friendly everyday products.

        Available products:
        ${JSON.stringify(Array.isArray(products) ? products.slice(0, 30) : [])}

        Recommend products from the catalogue when relevant.
        Include product names and prices in INR.
        Suggest practical sustainable alternatives.
        Explain materials and environmental benefits carefully.
        Never invent certifications or environmental claims.
        Never claim a product is biodegradable, organic,
        carbon neutral or recyclable without verified evidence.
        Be concise, friendly and useful.
      `,
      input: message
    });

    return NextResponse.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("ECORA AI error:", error);

    return NextResponse.json(
      { error: "Unable to connect to ECORA AI." },
      { status: 500 }
    );
  }
}
