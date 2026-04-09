# NYA BLO GESTION

**NYA BLO GESTION** est une plateforme SaaS multi-tenant professionnelle développée pour **NYA BLO SARL**. Elle permet la gestion centralisée de plusieurs entreprises partenaires, le suivi rigoureux des activités commerciales, et la génération automatisée de rapports.

## 🚀 Fonctionnalités Clés
- **Architecture Multi-Tenant** : Un seul système pour une infinité d'entreprises partenaires.
- **RBAC (Role-Based Access Control)** : 5 rôles distincts (Super Admin, Admin Entreprise, Superviseur, Commerciale, Lecteur).
- **Saisie Mobile-First** : Interface optimisée pour les commerciales sur le terrain.
- **Dashboard Premium** : Analytics en temps réel avec graphiques interactifs (Recharts).
- **Export de Données** : Génération de rapports PDF et Excel professionnels.
- **Sécurité Stricte** : Règles Firestore garantissant l'étanchéité des données entre entreprises.

## 🛠 Stack Technique
- **Frontend** : Next.js 15 (App Router), TypeScript, Tailwind CSS 4.
- **Backend/Auth** : Firebase (Authentication, Firestore, Storage).
- **Reporting** : jsPDF (PDF), xlsx (Excel).
- **Déploiement** : Vercel.

---

## 🔧 Configuration Firebase

### 1. Créer le projet
1. Allez sur la [Console Firebase](https://console.firebase.google.com/).
2. Créez un nouveau projet nommé `NYA BLO GESTION`.

### 2. Activer l'Authentification
1. Dans le menu "Authentication", activez la méthode **e-mail/mot de passe**.

### 3. Créer Firestore
1. Créez une base de données Firestore en mode production.
2. Copiez le contenu de `firestore.rules` (à la racine du projet) dans l'onglet "Rules" de Firestore.

### 4. Variables d'Environnement
Créez un fichier `.env.local` et ajoutez vos clés Firebase :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# Firebase Admin (pour les fonctions serveurs)
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 📦 Installation et Lancement

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev
```

---

## 🌍 Déploiement sur Vercel

1. Poussez le code sur un dépôt GitHub.
2. Connectez le dépôt à Vercel.
3. Ajoutez toutes les variables d'environnement listées dans le `.env.example` dans les paramètres Vercel.
4. Déployez !

---

## 🔑 Création du Premier Super Admin

Pour créer le premier compte :
1. Inscrivez-vous via l'interface Firebase Auth (ou créez un utilisateur manuellement).
2. Dans Firestore, créez un document dans la collection `users` avec l'ID correspondant à l'UID de l'utilisateur :
```json
{
  "displayName": "Admin Principal",
  "email": "admin@nyablo.com",
  "role": "super_admin",
  "active": true,
  "companies": []
}
```

---

## 📊 Structure des Données (Firestore)
- `companies` : Métadonnées des partenaires.
- `users` : Profils et accréditations.
- `daily_entries` : Points journaliers commerciaux.
- `audit_logs` : Historique des actions sensibles.
- `notification_settings` : Configuration des envois auto.

---

## 📧 Support
Développé avec excellence pour **NYA BLO SARL**.
Contact technique : support@nyablo.com
