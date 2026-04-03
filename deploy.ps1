# Script de Déploiement NYA BLO OS
Write-Host "🚀 Préparation du déploiement de production..." -ForegroundColor Cyan

# 1. Vérification du build local
Write-Host "📦 Vérification de l'intégrité du code..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur de build local. Déploiement annulé." -ForegroundColor Red
    exit $LASTEXITCODE
}

# 2. Push vers GitHub (Sécurité)
Write-Host "⬆️ Synchronisation GitHub..."
git add .
git commit -m "pre-deploy sync"
git push origin main

# 3. Déploiement Vercel
Write-Host "🌩️ Envoi vers Vercel Cloud..."
npx vercel --prod --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Déploiement réussi ! Votre Business OS est en ligne." -ForegroundColor Green
} else {
    Write-Host "⚠️ Le build Vercel a échoué. Vérifiez vos variables d'environnement sur le dashboard Vercel." -ForegroundColor Yellow
}
