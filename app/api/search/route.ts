import FullTextSearch from "@/model/FullTextSearch";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // Call the existing FullTextSearch CRUD
    const results = await FullTextSearch({ query });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Erro no GET /api/search:", error);
    return NextResponse.json(
      { error: "Erro ao buscar resultados" },
      { status: 500 }
    );
  }
}
