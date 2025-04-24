Write-Host "Introduce el mensaje del commit (deja vacío para cancelar):"
$mensaje = Read-Host
if ([string]::IsNullOrWhiteSpace($mensaje)) {
    Write-Host "Commit cancelado."
    exit 1
}
git add .
git commit -m "$mensaje"
git push
