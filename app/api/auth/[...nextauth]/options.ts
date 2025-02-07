import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UsuarioCRUD from "@/model/UsuarioCRUD";

//import Github from "next-auth/providers/github";

export const options: NextAuthOptions = {
  providers: [
    //Github({
    //  clientId: process.env.GITHUB_ID as string,
    //  clientSecret: process.env.GITHUB_SECRET as string,
    //}),
    CredentialsProvider({
      name: "Credentials", // Nome do provedor de autenticação
      credentials: {
        email: {
          label: "Email: ",
          type: "email",
          placeholder: "miguel@email.com",
        },
        password: { label: "Password: ", type: "password" },
      },

      async authorize(credentials) {
        console.log("Tentando fazer login...");

        // Verifica se as credenciais foram fornecidas
        if (!credentials) {
          console.error("Erro: Nenhuma credencial fornecida.");
          throw new Error("Credenciais não fornecidas.");
        }

        // Extrai o email e a senha do usuário
        const { email, password } = credentials;
        console.log("Credenciais recebidas:", { email, password });

        try {
          // Consulta o banco de dados para buscar o usuário pelo email
          console.log("Buscando usuário no banco de dados...");
          const result = await UsuarioCRUD("emailread", { Email: email });

          console.log("CRUD resultado do emailread:", result);

          // Verifica se o usuário foi encontrado e se os dados estão corretos
          if (result && Array.isArray(result) && result.length > 0) {
            const user = result[0]; // Pegamos o primeiro usuário retornado

            console.log("Usuário encontrado...");
            console.log("Validando senha...");
            // const isPasswordValid = await bcrypt.compare(password, user.Senha);
            // Verificação da senha (substitua pelo bcrypt.compare se usar hash)
            if (password === user.senha) {
              console.log("Senha válida! Autenticando usuário...");

              // Retorna os dados do usuário autenticado
              return {
                id: user.id, // ID do usuário (deve ser minúsculo)
                name: user.nome, // Nome do usuário
                email: user.email, // Email do usuário
              };
            } else {
              console.warn("Senha incorreta para o usuário:", email);
            }
          } else {
            console.warn("Usuário não encontrado:", email);
          }

          console.log("Autenticação falhou. Retornando null.");
          return null; // Retorna null se o login falhar
        } catch (error) {
          console.error("Erro durante a autenticação:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      //console.log("session - token: ", token);

      session.user = {
        id: (token.id as string) || null,
        name: token.name || null,
        email: token.email || null,
      };

      //console.log("session - session: ", session);
      return session;
    },

    async jwt({ token, user }) {
      //console.log("jwt - user: ", user);
      //console.log("jwt - token before: ", token);

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      //console.log("jwt - token after: ", token);
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
