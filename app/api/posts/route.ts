// app/api/posts/route.ts (or in `pages/api/posts.ts` for Next.js 12)
import { NextApiRequest, NextApiResponse } from "next";
import PostsCRUD from "@/model/PostCRUD";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { limit = "10", offset = "0" } = req.query;

    try {
      const posts = await PostsCRUD("list", {
        Limit: Number(limit),
        Offset: Number(offset),
      });

      console.log(posts); // Optional for debugging
      res.status(200).json(posts); // Respond with posts
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // If method is not GET, return method not allowed
    res.status(405).json({ error: "Method not allowed" });
  }
}
