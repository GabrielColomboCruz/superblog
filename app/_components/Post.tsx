"use client";

import { useRouter } from "next/navigation";
import React from "react";
import PostOptions from "./PostOptions";

interface PostProps {
  post: {
    id: number;
    titulo: string;
    conteudo: string;
    categoria: string;
    usuario: string;
    usuario_id: string;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const router = useRouter();
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza de que deseja excluir este post?")) return;

    try {
      const response = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao excluir o post");

      alert("Post excluído com sucesso!"); // Mensagem de sucesso

      // Adicionar lógica para remover o post da interface, por exemplo:
      // setPosts(posts.filter(post => post.id !== id));  // Remover o post da lista
    } catch (error) {
      console.error("Erro ao excluir o post:", error);
      alert("Ocorreu um erro ao tentar excluir o post. Tente novamente."); // Mensagem de erro
    }
  };

  return (
    <div className="w-full max-w-screen-sm mx-auto px-4 mt-4">
      <div className="relative w-full max-w-screen-md mx-auto bg-super-50 border border-super-200 rounded-lg shadow-md p-4 mb-6 min-h-[200px] max-h-[400px] overflow-hidden">
        {/* Title & Options Container */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl sm:text-2xl font-bold text-super-900">
            {post.titulo}
          </h2>
          <PostOptions
            postId={post.id}
            ownerId={post.usuario_id}
            onEdit={() => router.push(`/edit/${post.id}`)}
            onDelete={() => handleDelete(post.id)}
          />
        </div>

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
