import { NextResponse } from "next/server";

/**
 * Assistant Nommo (v2 Firebase)
 * Intégration via OpenRouter
 */
export async function POST(req: Request) {
  try {
    const { prompt, userName, contextData } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt manquant" }, { status: 400 });
    }

    // Protection par variable d'environnement
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "Clé IA non configurée" }, { status: 500 });
    }

    const systemPromptBase = `Tu es Nommo, l'assistant IA exécutif pour NYA BLO SARL (Côte d'Ivoire). Tu assistes le directeur (${userName || "Utilisateur" }). Tu es concis, pragmatique et orienté Business.
    VOICI LES DONNEES ACTUELLES DE L'ENTREPRISE (basées sur Firebase) :
    ${contextData ? contextData : "Aucune donnée lue pour le moment."}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "NYA BLO OS"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPromptBase
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur OpenRouter:", errorData);
      return NextResponse.json({ error: "Erreur API OpenRouter" }, { status: 500 });
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      text: data.choices[0].message.content 
    });

  } catch (error) {
    console.error("❌ Erreur Assistant IA:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
