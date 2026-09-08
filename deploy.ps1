# ==============================================================================
# SCRIPT DEPLOY OTOMATIS DSDMPT (LAPTOP -> VM 10.39.28.120)
# ==============================================================================
$ErrorActionPreference = "Stop"

$SERVER_USER = "sdm"
$SERVER_IP   = "10.39.28.120"
$SERVER_PORT = "22"
$REMOTE_PATH = "/home/sdm/dsdmpt"

$ROOT_DIR = $PSScriptRoot
$FRONTEND_DIR = Join-Path $ROOT_DIR "frontend"
$BACKEND_DIR  = Join-Path $ROOT_DIR "backend"
$RELEASE_DIR  = Join-Path $ROOT_DIR "release_dist"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   🚀 MEMULAI PROSES BUILD & DEPLOY DSDMPT        " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Bersihkan folder release lama
if (Test-Path $RELEASE_DIR) {
    Remove-Item -Recurse -Force $RELEASE_DIR
}
New-Item -ItemType Directory -Path (Join-Path $RELEASE_DIR "frontend") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $RELEASE_DIR "backend") -Force | Out-Null

# 2. BUILD FRONTEND (NEXT.JS STANDALONE)
Write-Host "`n[1/5] 📦 Building Frontend Next.js (Standalone Mode)..." -ForegroundColor Yellow
Set-Location $FRONTEND_DIR
npm run build

Write-Host "Copying standalone frontend files..." -ForegroundColor DarkGray
# Copy standalone server
Copy-Item -Recurse -Force "$FRONTEND_DIR\.next\standalone\*" "$RELEASE_DIR\frontend\"
# Copy static assets & public ke lokasi yang tepat
New-Item -ItemType Directory -Path "$RELEASE_DIR\frontend\.next" -Force | Out-Null
Copy-Item -Recurse -Force "$FRONTEND_DIR\.next\static" "$RELEASE_DIR\frontend\.next\static"
if (Test-Path "$FRONTEND_DIR\public") {
    Copy-Item -Recurse -Force "$FRONTEND_DIR\public" "$RELEASE_DIR\frontend\public"
}
# Copy file .env frontend jika ada
if (Test-Path "$FRONTEND_DIR\.env") {
    Copy-Item -Force "$FRONTEND_DIR\.env" "$RELEASE_DIR\frontend\.env"
}

# 3. COMPILE BACKEND (GO TO LINUX AMD64)
Write-Host "`n[2/5] 🐹 Compiling Backend Go (Target Linux 64-bit)..." -ForegroundColor Yellow
Set-Location $BACKEND_DIR
$env:GOOS = "linux"
$env:GOARCH = "amd64"
$env:CGO_ENABLED = "0"
go build -ldflags="-s -w" -o "$RELEASE_DIR\backend\dsdmpt-backend" ./cmd/api

# Copy file .env backend jika ada
if (Test-Path "$BACKEND_DIR\.env") {
    Copy-Item -Force "$BACKEND_DIR\.env" "$RELEASE_DIR\backend\.env"
}

# 4. PACKAGING ARTIFACT (TAR.GZ)
Write-Host "`n[3/5] 🗜️  Membuat Paket Arsip dsdmpt-release.tar.gz..." -ForegroundColor Yellow
Set-Location $RELEASE_DIR
tar -czf "$ROOT_DIR\dsdmpt-release.tar.gz" *

# 5. TRANSFER KE SERVER VIA SCP
Write-Host "`n[4/5] 📤 Mengirim Artifact ke Server ($SERVER_IP)..." -ForegroundColor Yellow
Set-Location $ROOT_DIR
scp -P $SERVER_PORT "$ROOT_DIR\dsdmpt-release.tar.gz" "${SERVER_USER}@${SERVER_IP}:/tmp/dsdmpt-release.tar.gz"

# 6. EKSTRAK & RESTART SERVICE DI SERVER
Write-Host "`n[5/5] 🔄 Ekstrak dan Restart Service di Server..." -ForegroundColor Yellow

$REMOTE_COMMANDS = @"
mkdir -p $REMOTE_PATH/frontend $REMOTE_PATH/backend
tar -xzf /tmp/dsdmpt-release.tar.gz -C $REMOTE_PATH/
chmod +x $REMOTE_PATH/backend/dsdmpt-backend
rm -f /tmp/dsdmpt-release.tar.gz

# Restart Process via PM2
if command -v pm2 &> /dev/null; then
    echo 'Restarting PM2 processes...'
    pm2 restart dsdmpt-dev || pm2 restart dsdmpt-frontend || pm2 start $REMOTE_PATH/frontend/server.js --name "dsdmpt-frontend" -- --port 3002
    pm2 restart dsdmpt-backend || pm2 start $REMOTE_PATH/backend/dsdmpt-backend --name "dsdmpt-backend"
fi

echo '✅ Deployment Selesai Sukses!'
"@

ssh -p $SERVER_PORT "${SERVER_USER}@${SERVER_IP}" $REMOTE_COMMANDS

# Bersihkan sisa build lokal
Remove-Item -Force "$ROOT_DIR\dsdmpt-release.tar.gz"
Remove-Item -Recurse -Force $RELEASE_DIR

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "   🎉 DEPLOYMENT BERHASIL DILAKUKAN!             " -ForegroundColor Green
Write-Host "   URL: http://$SERVER_IP/dsdmpt                  " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
