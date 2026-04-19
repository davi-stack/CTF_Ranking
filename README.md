# Red Hack CTF

Plataforma de CTF com dois perfis de uso:

- competidor: visualiza descrições das flags, acompanha progresso, submete flags e consulta ranking estilo BOCA
- administrador: importa `usuarios.csv` e `flags.csv`, edita pontuação global por número de flag, adiciona observações por competidor e acompanha submissões

## Requisitos

- Node.js 20+
- variáveis `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `JWT_SECRET`

## Bootstrap inicial

1. Execute o SQL em [supabase/schema.sql](supabase/schema.sql) no editor SQL do Supabase.
2. Crie o usuário admin:

```bash
npm run admin:create -- --password="sua-senha-forte"
```

3. Inicie a aplicação:

```bash
npm run dev
```

4. Acesse `/login` e entre com `admin`.
5. No painel `/admin`, use a importação dos CSVs para carregar `usuarios.csv` e `flags.csv` diretamente pela interface.

## Tasks VS Code

O workspace inclui [tasks.json](.vscode/tasks.json) com estas tasks:

- `CTF: dev`
- `CTF: lint`
- `CTF: build`
- `CTF: create admin`

## Fluxos principais

### Competidor

- `/ctf`: dashboard com descrições, status e pontuação das flags
- `/ctf/submit`: submissão protegida por cookie `httpOnly`, verificação de origem e rate limit
- `/ctf/ranking`: ranking estilo BOCA com `master.png`

### Administrador

- `/admin`: importar CSV, ver resumo dos competidores e abrir cada flag
- `/admin/flags/[numero]`: editar título, descrição, disponibilidade, pontuação e observações por usuário

## Segurança aplicada

- sessão em cookie `httpOnly` com `sameSite=strict`
- proteção de origem para `POST` sensíveis
- rate limiting de login e submissão para reduzir brute-force
- bloqueio de reenvio de flag já resolvida
- `admin` tratado como papel administrativo pelo login
