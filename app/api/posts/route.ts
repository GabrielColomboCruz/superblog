import { NextResponse } from "next/server";
import PostsCRUD from "@/model/PostCRUD";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    const posts = await PostsCRUD("list", {
      Limit: String(limit),
      Offset: String(offset),
    });
    console.log(posts);

    return NextResponse.json(posts);
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
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.error();
  }
}
