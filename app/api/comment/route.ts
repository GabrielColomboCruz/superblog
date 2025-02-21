import { NextResponse } from "next/server";
import ComentariosCRUD from "@/model/ComentarioCRUD";
import NotificacaoCRUD from "@/model/NotificacaoCRUD";

export async function GET(request: Request) {
  try {
    //console.log("📩 Recebendo requisição GET para comentários...");

    const { searchParams } = new URL(request.url);
    const Conteudo = searchParams.get("Conteudo") || null;
    const Usuario = searchParams.get("Usuario") || null;
    const Post = searchParams.get("Post") || null;

    console.log(
      "📌 Parâmetros recebidos ->",
      `Conteudo: ${Conteudo}, Usuario: ${Usuario}, Post: ${Post}`
    );

    if (Conteudo) {
      console.warn(
        "⚠️ GET create está obsoleto. Verifique se deveria estar aqui."
      );
    }

    if (Post) {
      // console.log(`🔍 Buscando comentários para o post ID: ${Post}`);
      try {
        const result = await ComentariosCRUD("postread", { Post });

        // console.log("✅ Comentários encontrados:", result);
        return NextResponse.json({ status: 200, result });
      } catch (error) {
        console.error("❌ Erro ao buscar comentários por Post:", error);
        return NextResponse.json(
          { error: "Erro ao buscar comentários" },
          { status: 500 }
        );
      }
    }

    //console.log("📂 Buscando todos os comentários...");
    const result = await ComentariosCRUD("list");

    //console.log("✅ Lista de comentários retornada:", result);
    return NextResponse.json({ status: 200, posts: result });
  } catch (error) {
    console.error("❌ Erro ao buscar comentários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar comentários" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("📝 Recebendo requisição POST para criar comentário...");

    const data = await request.json();
    const Conteudo = data.Conteudo || null;
    const Usuario = data.Usuario || null;
    const Post = data.Post || null;
    const Owner = data.Owner || null;

    console.log(
      "📌 Dados recebidos ->",
      `Conteudo: ${Conteudo}, Usuario: ${Usuario}, Post: ${Post}, Owner: ${Owner}`
    );

    // 🚨 Segurança: Deve validar o usuário logado antes de criar comentários
    if (!Usuario) {
      console.warn("⚠️ Tentativa de criação de comentário sem usuário!");
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    if (!Conteudo || !Post) {
      console.warn(
        "⚠️ Tentativa de criação de comentário com dados incompletos!"
      );
      return NextResponse.json(
        { error: "Conteúdo e Post são obrigatórios" },
        { status: 400 }
      );
    }

    console.log("✅ Criando comentário...");
    const result = await ComentariosCRUD("create", {
      Conteudo,
      Usuario,
      Post,
    });
    //console.log("🎉 Comentário criado com sucesso:", result);

    if (Owner) {
      console.log("Comentario no post de ", Owner);
      //sendNotification(Owner, `Novo comentario no seu post!`);
    }
    if (Usuario !== Owner) {
      try {
        console.log("🔔 Trying to create notification");
        const result = await NotificacaoCRUD("create", {
          Conteudo: `New comment on your post: "${Conteudo.substring(0, 10)}${
            Conteudo.length > 10 ? "..." : ""
          }"`,
          Usuario: Owner,
          Post,
        });
        console.log("Resesult : ", result);
      } catch (error) {}
    }

    return NextResponse.json({ status: 200, result });
  } catch (error) {
    console.error("❌ Erro ao criar comentário:", error);
    return NextResponse.json(
      { error: "Erro ao criar comentário" },
      { status: 500 }
    );
  }
}
