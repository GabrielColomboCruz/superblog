"use client";

import { useState, useEffect } from "react";
import {
  postsCategoryRead,
  postsIdRead,
  postsList,
  postsUsuarioRead,
} from "@/actions/post";

interface PostProps {
  userId?: string;
  postId?: string;
  categoryId?: string;
}

interface Post {
  id: number;
  titulo: string;
  conteudo: string;
  categoria: string;
  usuario: string;
}

export default function Post({ userId, postId, categoryId }: PostProps) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let result;
        if (postId) {
          result = await postsIdRead(postId);
        } else if (userId) {
          result = await postsUsuarioRead(userId);
        } else if (categoryId) {
          result = await postsCategoryRead(categoryId);
        } else {
          result = await postsList();
        }
        console.log(result);
        setPosts(Array.isArray(result) ? result : [result]);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    fetchPosts();
  }, [userId, postId, categoryId]);

  return (
    <div>
      <h1>Posts</h1>
      <div>
        <div className="flex justify-center">
          <div className="max-w-[50ch] p-4 text-center">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="border p-4 mb-4 shadow-md">
                  <h2 className="text-xl font-bold">{post.titulo}</h2>
                  <p className="text-gray-300">Category: {post.categoria}</p>
                  <p className="text-gray-400">{post.conteudo}</p>
                  <p className="text-sm text-gray-500">
                    Posted by: {post.usuario}
                  </p>
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
