import { NextResponse } from "next/server";
import CategoriaCRUD from "@/model/CategoriaCRUD";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const Id = searchParams.get("Id") || null;
    if (Id) {
      const result = await CategoriaCRUD("idread", {
        Id: String(Id),
      });
      return NextResponse.json(result);
    }

    const result = await CategoriaCRUD("list");

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
    const Nome = data.Nome || null;
    const Descricao = data.Descricao || null;
    if (action) {
      const result = await CategoriaCRUD(action, {
        Id,
        Nome,
        Descricao,
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
