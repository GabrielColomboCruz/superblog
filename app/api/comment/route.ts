import { NextResponse } from "next/server";
import ComentariosCRUD from "@/model/ComentarioCRUD";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const Conteudo = searchParams.get("Conteudo") || null;
    const Usuario = searchParams.get("Usuario") || null;
    const Post = searchParams.get("Post") || null;
    if (Conteudo) {
      console.log(
        "GET create deprecated\n Conteudo : ",
        Conteudo,
        "\n Usuario : ",
        Usuario,
        "\nPost : ",
        Post
      );
    }
    if (Post) {
      try {
        //!! Perigoso
        //!! Quaquer um com a rota correta pode criar um comentario desde que saiba o id do seu Usuario
        //!! O mesmo se aplica a criação de posts
        //!! Quando possivel fazer com que criação de items requeira confirmação da session de quem ta logado
        const result = await ComentariosCRUD("postread", {
          Post,
        });
        return NextResponse.json({
          result,
          status: 200,
        });
      } catch (error) {
        console.error("Error fetching comment by post:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    }
    console.log(Post);
    const posts = await ComentariosCRUD("list");
    //console.log(posts);
    return NextResponse.json({ posts, status: 200 });
  } catch (error) {
    console.error("Error fetching comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const Conteudo = data.Conteudo || null;
    const Usuario = data.Usuario || null;
    const Post = data.Post || null;

    const result = await ComentariosCRUD("create", {
      Conteudo,
      Usuario,
      Post,
    });
    return NextResponse.json({
      status: 200,
      result,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
