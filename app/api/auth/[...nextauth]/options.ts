import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UsuarioCRUD from "@/model/UsuarioCRUD";
import Github from "next-auth/providers/github";

export const options: NextAuthOptions = {
  providers: [
    Github({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email: ",
          type: "email",
          placeholder: "miguel@email.com",
        },
        password: { label: "Password: ", type: "password" },
      },
      async authorize(credentials) {
        // Verifique se credentials existe
        if (!credentials) {
          throw new Error("Credenciais não fornecidas.");
        }

        const { email, password } = credentials;

        try {
          // Busca o usuário pelo email
          const result = await UsuarioCRUD("emailread", { Email: email });

          // Valida se o usuário existe e se a senha está correta
          if (result && Array.isArray(result) && result.length > 0) {
            const user = result[0]; // Aqui você pode acessar o primeiro item do array
            //const isPasswordValid = await bcrypt.compare(              credentials.password,              user.Senha            );
            if (password == user.senha) {
              console.log(user);
              return {
                id: user.id, // Ensure lowercase 'id' (not 'Id')
                name: user.nome, // Ensure lowercase 'name' (not 'Nome')
                email: user.email, // Ensure lowercase 'email' (not 'Email')
              };
            }
          }
          return null; // Retorna null para credenciais inválidas
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
