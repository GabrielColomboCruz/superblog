import { NextApiRequest, NextApiResponse } from "next";
import PostsCRUD from "@/model/PostCRUD";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { limit = "10", offset = "0" } = req.query;

    const posts = await PostsCRUD("list", {
      Limit: Number(limit),
      Offset: Number(offset),
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
