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

    const systemPromptBase = `Tu es Nommo, l'assistant IA exécutif pour NYA BLO SARL (Abidjan, Côte d'Ivoire). Tu assistes le Directeur Général ${userName ? `(${userName})` : ""} dans le pilotage de 4 filiales :
    1. GALF (BTP & Formation) : Focus sur la sécurité, les certifications et les marges de gros œuvres.
    2. Yoela Flowers (Fleuriste Luxe) : Focus sur la gestion des stocks périssables et les pics saisonniers.
    3. Yoela Beauty (Bien-être) : Focus sur la fidélisation client et l'optimisation des rendez-vous.
    4. NYA BLO Digital (Tech) : Focus sur le backlog projet et la rentabilité horaire.

    TA MISSION : Analyser les données fournies via Firebase et conseiller sur la rentabilité, le CRM et les alertes de gestion. Sois concis, professionnel, et utilise un ton pragmatique.
    
    VOICI LES DONNEES ACTUELLES (Firebase Context) :
    ${contextData ? contextData : "Aucune donnée lue pour le moment. Demande à l'utilisateur de synchroniser."}`;

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
