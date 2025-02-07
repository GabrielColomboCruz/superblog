import { NextResponse } from "next/server";
import PostsCRUD from "@/model/PostCRUD";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const usuario = searchParams.get("usuario");
    const categoria = searchParams.get("categoria");
    const Limit = searchParams.get("limit");
    const Offset = searchParams.get("offset");

    //console.log("Recebendo GET com parâmetros:", { id, usuario, categoria });

    let result;
    if (id) {
      result = await PostsCRUD("idread", { Id: id });
    } else if (usuario) {
      result = await PostsCRUD("usuarioread", { Usuario: usuario });
    } else if (categoria) {
      result = await PostsCRUD("categoriaread", { Categoria: categoria });
    } else {
      result = await PostsCRUD("list", { Limit, Offset });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro no GET:", error);
    return NextResponse.json(
      { error: "Erro ao buscar posts" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const { Titulo, Conteudo, Usuario, Categoria } = await request.json();
    //console.log("Criando novo post:", { Titulo, Conteudo, Usuario, Categoria });

    if (!Titulo || !Conteudo || !Usuario || !Categoria) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const result = await PostsCRUD("create", {
      Titulo,
      Conteudo,
      Usuario,
      Categoria,
    });

    return NextResponse.json({ status: 201, result });
  } catch (error) {
    console.error("Erro no POST:", error);
    return NextResponse.json({ error: "Erro ao criar post" }, { status: 500 });
  }
}
export async function PUT(request: Request) {
  try {
    const { Id, Titulo, Conteudo } = await request.json();
    //console.log("Atualizando post:", { Id, Titulo, Conteudo });

    if (!Id || (!Titulo && !Conteudo)) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const result = await PostsCRUD("update", { Id, Titulo, Conteudo });

    return NextResponse.json({ status: 200, result });
  } catch (error) {
    console.error("Erro no PUT:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar post" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    //console.log("Tentando excluir post:", { id });

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const result = await PostsCRUD("delete", { Id: id });

    return NextResponse.json({ status: 200, result });
  } catch (error) {
    console.error("Erro no DELETE:", error);
    return NextResponse.json(
      { error: "Erro ao deletar post" },
      { status: 500 }
    );
  }
}
