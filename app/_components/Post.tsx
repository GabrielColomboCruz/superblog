"use client";
import React from "react";

interface PostProps {
  post: {
    id: number;
    titulo: string;
    conteudo: string;
    categoria: string;
    usuario: string;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="w-full max-w-screen-sm mx-auto px-4">
      <div className="w-full max-w-screen-md mx-auto bg-super-50 border border-super-200 rounded-lg shadow-md p-4 mb-6  min-h-[200px] max-h-[400px] overflow-hidden">
        <h2 className="text-xl sm:text-2xl font-bold text-super-900 mb-2">
          {post.titulo}
        </h2>
        <p className="text-sm text-super-600">Category: {post.categoria}</p>
        <p className="mt-2 text-super-800 line-clamp-5">{post.conteudo}</p>
        <div className="mt-4 text-right text-super-500 text-sm">
          Posted by: {post.usuario}
        </div>
      </div>
    </div>
  );
};

export default Post;
