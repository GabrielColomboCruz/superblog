import { NextResponse } from "next/server";
import EditedPostsCRUD from "@/model/EditedPostCRUD";
//import { getSession } from "next-auth/react";

export async function GET(request: Request) {
  try {
    //const session = await getSession(); // Get user session
    //const userId = session?.user?.id || null;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const usuario = searchParams.get("usuario");
    const categoria = searchParams.get("categoria");
    const post = searchParams.get("post");
    const Limit = searchParams.get("limit");
    const Offset = searchParams.get("offset");

    //console.log("Recebendo GET com parâmetros:", { id, usuario, categoria });

    let result;
    if (id) {
      result = await EditedPostsCRUD("idread", { Id: id });
    } else if (usuario) {
      result = await EditedPostsCRUD("usuarioread", { Usuario: usuario });
    } else if (categoria) {
      result = await EditedPostsCRUD("categoriaread", { Categoria: categoria });
    } else if (post) {
      result = await EditedPostsCRUD("postread", { Post: post });
    } else {
      result = await EditedPostsCRUD("list", { Limit, Offset });
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
    const { Titulo, Conteudo, Usuario, Categoria, Post } = await request.json();
    //console.log("Criando novo post:", { Titulo, Conteudo, Usuario, Categoria });

    if (!Titulo || !Conteudo || !Usuario || !Categoria || !Post) {
      console.log("error dados incompletos");

      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }
    console.log(Titulo, Conteudo, Usuario, Categoria, Post);
    const result = await EditedPostsCRUD("create", {
      Titulo,
      Conteudo,
      Usuario,
      Categoria,
      Post,
    });

    return NextResponse.json({ status: 201, result });
  } catch (error) {
    console.error("Erro no POST:", error);
    return NextResponse.json({ error: "Erro ao criar post" }, { status: 500 });
  }
}
