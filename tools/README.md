# Herramientas

## `winscp/`

Copia portable de WinSCP que usa `deploy/deploy-hosting.ps1` para subir los
archivos al hosting compartido (SFTP).

- No se versiona (son ~20 MB de binarios): está en `.gitignore`.
- Si no la tienes, descarga **WinSCP Portable** desde <https://winscp.net/eng/download.php>
  y descomprímela en `tools/winscp/` (debe existir `tools/winscp/WinSCP.com`).
- También funciona si `WinSCP.com` está en el `PATH`.
