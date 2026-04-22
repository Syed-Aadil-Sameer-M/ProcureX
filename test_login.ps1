$body = '{"email":"aadil@procurex.com","password":"aadil@123"}'
$headers = @{"Content-Type"="application/json"}
Write-Host "--- TESTING LOGIN (Real DB) ---"
try {
    $r = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -Headers $headers -UseBasicParsing
    Write-Host "STATUS:" $r.StatusCode
    Write-Host "BODY:" $r.Content
} catch {
    Write-Host "ERROR:" $_.ErrorDetails.Message
    if (!$_.ErrorDetails.Message) { Write-Host "CONNECTION ERROR - Backend may be down:" $_.Exception.Message }
}
