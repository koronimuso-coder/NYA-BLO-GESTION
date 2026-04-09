import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    if (!process.env.GOOGLE_GENAI_API_KEY) {
      return NextResponse.json(
        { error: "La clé API Nommo n'est pas configurée." },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Tu es "Nommo", l'esprit gardien de l'intelligence commerciale de NYA BLO SARL. 
      Ton ton est sage, professionnel, et imprégné de la culture Dogon (équilibre, harmonie, terre, sagesse ancestrale).
      
      Contexte de l'utilisateur :
      - Nom : ${context?.userName || "Inconnu"}
      - Rôle : ${context?.role || "Visiteur"}
      
      Instructions :
      1. Réponds en français.
      2. Sois concis mais percutant.
      3. Utilise des métaphores liées à la terre, aux semailles ou à l'harmonie quand c'est pertinent.
      4. Aide l'utilisateur avec ses questions sur la gestion commerciale de NYA BLO.
      
      Message de l'utilisateur : ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Nommo AI Error:", error);
    return NextResponse.json(
      { error: "L'esprit de Nommo est momentanément indisponible." },
      { status: 500 }
    );
  }
}
