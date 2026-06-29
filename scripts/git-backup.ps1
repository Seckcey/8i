param(
    [string]$Message = "Update 8i Wallet project"
)

Set-Location "$env:OneDrive\8 West Ventures\Projects\8i-wallet"

Write-Host "Checking Git status..." -ForegroundColor Cyan
git status

Write-Host "Adding changes..." -ForegroundColor Cyan
git add .

Write-Host "Committing changes..." -ForegroundColor Cyan
git commit -m "$Message"

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push

Write-Host "Git backup routine complete." -ForegroundColor Green
