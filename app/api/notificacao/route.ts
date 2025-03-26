import { NextResponse } from "next/server";
import NotificacaoCRUD from "@/model/NotificacaoCRUD";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const Usuario = searchParams.get("Usuario") || null;
    const Post = searchParams.get("Post") || null;

    console.log(
      "📌 Parâmetros recebidos ->",
      `Usuario: ${Usuario}, Post: ${Post}`
    );

    if (Post) {
      try {
        const result = await NotificacaoCRUD("postread", { Post });
        return NextResponse.json({ status: 200, result });
      } catch (error) {
        console.error("❌ Erro ao buscar comentários por Post:", error);
        return NextResponse.json(
          { error: "Erro ao buscar comentários" },
          { status: 500 }
        );
      }
    }
    if (Usuario) {
      try {
        const result = await NotificacaoCRUD("usuarioread", { Usuario });
        return NextResponse.json({ status: 200, result });
      } catch (error) {
        console.error("❌ Erro ao buscar comentários por Post:", error);
        return NextResponse.json(
          { error: "Erro ao buscar comentários" },
          { status: 500 }
        );
      }
    }
    const result = await NotificacaoCRUD("list");
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
    console.log("📝 Recebendo requisição POST para criar notificação...");

    const data = await request.json();
    const Conteudo = data.Conteudo || null;
    const Post = data.Post || null;
    const Owner = data.Owner || null;

    console.log(
      "📌 Dados recebidos ->",
      `Conteudo: ${Conteudo}, Usuario: ${Owner}, Post: ${Post}`
    );
    // 🚨 Segurança: Deve validar o usuário logado antes de criar comentários
    if (!Conteudo || !Post || !Owner) {
      console.warn(
        "⚠️ Tentativa de criação de notificação com dados incompletos!"
      );
      return NextResponse.json(
        { error: "Conteúdo, Post e Owner são obrigatórios" },
        { status: 400 }
      );
    }
    console.log("✅ Criando notificação...");
    const result = await NotificacaoCRUD("create", {
      Conteudo: `New comment on your post: "${Conteudo.substring(0, 50)}${
        Conteudo.length > 50 ? "..." : ""
      }"`,
      Usuario: Owner,
      Post,
    });
    return NextResponse.json({ status: 200, result });
  } catch (error) {
    console.error("❌ Erro ao criar notificação:", error);
    return NextResponse.json(
      { error: "Erro ao criar notificação" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { Id, Read } = await request.json();

    if (!Id || !Read) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }
    console.log("Atualizando Notificação:", { Id, Read });
    const result = await NotificacaoCRUD("readed", {
      Id: Id,
      Read: Read,
    });

    return NextResponse.json({ status: 200, result });
  } catch (error) {
    console.error("Erro no PUT:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar post" },
      { status: 500 }
    );
  }
}
