import { GoogleAuth } from "google-auth-library";
import axios from "axios";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

async function run() {
console.log("🎬 Démarrage du déploiement automatique...");
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const projectId = "nya-blo-gestion";
const keyFile = path.resolve(process.cwd(), "service-account.json");
const rulesFile = path.resolve(process.cwd(), "firestore.rules");

try {
    const rulesContent = fs.readFileSync(rulesFile, "utf8");
    const auth = new GoogleAuth({
      keyFile: keyFile,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    console.log("🔑 Authentification en cours...");
    const client = await auth.getClient();
    const headers = await client.getRequestHeaders();

    console.log("📡 Envoi du nouveau Ruleset...");
    const rulesetResponse = await axios.post(
      `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`,
      {
        source: {
          files: [{ name: "firestore.rules", content: rulesContent }],
        },
      },
      { headers }
    );

    const rulesetName = rulesetResponse.data.name;
    console.log(`✅ Ruleset créé: ${rulesetName}`);

    console.log("🔄 Activation du Ruleset (Release)...");
    await axios.patch(
      `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases/cloud.firestore`,
      { release: { rulesetName } },
      { headers }
    );

    console.log("✨ SUCCÈS : Vos règles sont maintenant actives !");
} catch (error: any) {
    console.error("❌ ERREUR:", error.response?.data || error.message);
}
}

run();
