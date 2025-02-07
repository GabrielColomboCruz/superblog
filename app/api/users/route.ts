import { NextResponse } from "next/server";
import UsuarioCRUD from "@/model/UsuarioCRUD";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const Id = searchParams.get("Id") || null;
    const Email = searchParams.get("Email") || null;

    //console.log("Recebendo requisição GET para usuários...");
    //console.log(`Parâmetros recebidos -> Id: ${Id}, Email: ${Email}`);

    if (Id) {
      //console.log(`Tentando buscar usuário por ID: ${Id}`);
      const result = await UsuarioCRUD("idread", { Id: String(Id) });
      //console.log("Resultado da busca por ID:", result);
      return NextResponse.json(result);
    }

    if (Email) {
      //console.log(`Tentando buscar usuário por Email: ${Email}`);
      const result = await UsuarioCRUD("emailread", { Email });
      //console.log("Resultado da busca por Email:", result);
      return NextResponse.json(result);
    }

    //console.log("Buscando todos os usuários...");
    const result = await UsuarioCRUD("list");
    //console.log("Lista de usuários retornada:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("Recebendo requisição POST para usuários...");

    const data = await request.json();
    const action = data.action || null;
    const Id = data.Id || null;
    const Nome = data.Nome || null;
    const Email = data.Email || null;
    const Senha = data.Senha || null;

    //console.log(`Ação recebida: ${action}`);
    //console.log(`Dados recebidos -> Id: ${Id}, Nome: ${Nome}, Email: ${Email}`);

    if (!action) {
      console.warn("Nenhuma ação fornecida na requisição POST.");
      return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }

    const result = await UsuarioCRUD(action, {
      Id,
      Nome,
      Email,
      Senha,
    });

    //console.log("Resultado da operação:", result);

    return NextResponse.json({ status: 200, result });
  } catch (error) {
    console.error("Erro ao processar requisição POST:", error);
    return NextResponse.json(
      { error: "Erro ao processar usuário" },
      { status: 500 }
    );
  }
}
