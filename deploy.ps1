# Script de Deploiement NYA BLO OS
Write-Host "Preparatifs du deploiement de production..." -ForegroundColor Cyan

# 1. Verification du build local
Write-Host "Verification de l'integrite du build local..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur de build local. Deploiement annule." -ForegroundColor Red
    exit $LASTEXITCODE
}

# 2. Push vers GitHub (Securite)
Write-Host "Synchronisation GitHub..."
git add .
git commit -m "pre-deploy sync"
git push origin main

# 3. Deploiement Vercel
Write-Host "Envoi vers Vercel Cloud..."
npx vercel --prod --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deploiement reussi ! Votre Business OS est en ligne." -ForegroundColor Green
} else {
    Write-Host "Le build Vercel a echoue. Verifiez vos variables d'environnement sur le dashboard Vercel." -ForegroundColor Yellow
}
