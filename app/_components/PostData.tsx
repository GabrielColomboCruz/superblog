"use client";
import React from "react";

interface Post {
  id: number;
  titulo: string;
  conteudo: string;
  categoria: string;
  usuario: string;
}
interface PostProps {
  post: Post;
}

export default function PostData({ post }: PostProps) {
  return (
    <div className="flex justify-center">
      <div className="max-w-[50ch] p-4 text-center">
        <div className="border p-4 mb-4 shadow-md">
          <h2 className="text-xl font-bold">{post.titulo}</h2>
          <p className="text-gray-300">Category: {post.categoria}</p>
          <p className="text-gray-400">{post.conteudo}</p>
          <p className="text-sm text-gray-500">Posted by: {post.usuario}</p>
        </div>
      </div>
    </div>
  );
}
