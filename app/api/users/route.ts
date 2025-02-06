import { NextResponse } from "next/server";
import UsuarioCRUD from "@/model/UsuarioCRUD";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const Id = searchParams.get("Id") || null;
    const Email = searchParams.get("Email") || null;
    if (Id) {
      const result = await UsuarioCRUD("idread", {
        Id: String(Id),
      });
      return NextResponse.json(result);
    }
    if (Email) {
      const result = await UsuarioCRUD("emailread", {
        Email: Email,
      });
      return NextResponse.json(result);
    }

    const result = await UsuarioCRUD("list");

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
    const Email = data.Email || null;
    const Senha = data.Senha || null;
    if (action) {
      const result = await UsuarioCRUD(action, {
        Id,
        Nome,
        Email,
        Senha,
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
