# Superblog

Este é um projeto Next.js inicializado com create-next-app.

## Configuração Inicial
Antes de começar, crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis de ambiente:

``` env
DB_HOST=seu_host_do_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco_de_dados

NEXTAUTH_SECRET=sua_chave_secreta

GITHUB_ID=sua_github_id
GITHUB_SECRET=sua_github_secret
```
As variáveis DB_HOST, DB_USER, DB_PASSWORD e DB_NAME são usadas para configurar o banco de dados MySQL.

O NEXTAUTH_SECRET é uma chave secreta usada pelo NextAuth para segurança e criptografia. Você pode gerar um valor seguro usando o comando:

```bash
openssl rand -base64 32
```
As variáveis GITHUB_ID e GITHUB_SECRET são usadas para configurar a autenticação via GitHub OAuth.

## Github OAuth não esta funcionando
### Como configurar o GitHub OAuth
Acesse GitHub Developer Settings.
Clique em "New OAuth App".
Preencha os seguintes campos:
Application Name: Escolha um nome para sua aplicação.
Homepage URL: http://localhost:3000
Authorization Callback URL: http://localhost:3000/api/auth/callback/github
Após criar a aplicação, copie o Client ID e Client Secret e adicione ao seu .env.local como GITHUB_ID e GITHUB_SECRET.


## Como começar
Primeiro, instale as dependências:

```
npm install next
```

Em seguida, inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra http://localhost:3000 no seu navegador para ver o resultado.



### Este é um projeto em desenvolvimento logo sugeito a bugs
## Esta incluido no projeto a pasta structure que contem o sql para criar o banco de dados
