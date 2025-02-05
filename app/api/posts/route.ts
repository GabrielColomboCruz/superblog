import { NextResponse } from "next/server";
import PostsCRUD from "@/model/PostCRUD";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";
    const Id = searchParams.get("Id") || null;
    const Category = searchParams.get("category") || null;
    if (Id) {
      const result = await PostsCRUD("idread", {
        Id: String(Id),
      });

      return NextResponse.json(result);
    }
    if (Category) {
      const result = await PostsCRUD("categoriaread", {
        Categoria: String(Category),
      });

      return NextResponse.json(result);
    }

    const result = await PostsCRUD("list", {
      Limit: String(limit),
      Offset: String(offset),
    });
    console.log(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const action = data.action || null;
    const Id = data.Id || null;
    const Conteudo = data.Conteudo || null;
    const Usuario = data.Usuario || null;
    const Categoria = data.Categoria || null;
    const Titulo = data.Titulo || null;
    if (action) {
      const result = await PostsCRUD(action, {
        Id,
        Titulo,
        Conteudo,
        Usuario,
        Categoria,
      });
      return NextResponse.json({
        status: 200,
        result,
      });
    }
    return NextResponse.json({ error: "Method not allowed" }, { status: 500 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
