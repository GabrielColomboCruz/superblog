import { NextResponse } from "next/server";
import CategoriaCRUD from "@/model/CategoriaCRUD";

export async function GET(request: Request) {
  try {
    //console.log("📩 Recebendo requisição GET para categorias...");

    const { searchParams } = new URL(request.url);
    const Id = searchParams.get("Id") || null;

    if (Id) {
      //console.log(`🔍 Buscando categoria por ID: ${Id}`);
      const result = await CategoriaCRUD("idread", { Id: String(Id) });

      //console.log("✅ Categoria encontrada:", result);
      return NextResponse.json(result);
    }

    //console.log("📂 Buscando todas as categorias...");
    const result = await CategoriaCRUD("list");

    //console.log("✅ Lista de categorias retornada:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Erro ao buscar categorias:", error);
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // console.log("📝 Recebendo requisição POST para modificar categoria...");

    const data = await request.json();
    const action = data.action || null;
    const Id = data.Id || null;
    const Nome = data.Nome || null;
    const Descricao = data.Descricao || null;

    if (!action) {
      return NextResponse.json(
        { error: "Ação não especificada" },
        { status: 400 }
      );
    }

    //console.log(
    //  "📌 Dados recebidos ->",
    //  `Ação: ${action}, ID: ${Id}, Nome: ${Nome}, Descrição: ${Descricao}`
    //);

    const result = await CategoriaCRUD(action, { Id, Nome, Descricao });

    //console.log("🎉 Categoria modificada com sucesso:", result);
    return NextResponse.json({ status: 200, result });
  } catch (error) {
    console.error("❌ Erro ao modificar categoria:", error);
    return NextResponse.json(
      { error: "Erro ao modificar categoria" },
      { status: 500 }
    );
  }
}
