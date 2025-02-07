"use client";

//import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

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
  //const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []); // Only run once when the component mounts

  const isOwner = session?.user?.id === post.usuario_id;

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
      <div className="w-full max-w-screen-md mx-auto bg-super-50 border border-super-200 rounded-lg shadow-md p-4 mb-6 min-h-[200px] max-h-[400px] overflow-hidden">
        <h2 className="text-xl sm:text-2xl font-bold text-super-900 mb-2">
          {post.titulo}
        </h2>
        <p className="text-sm text-super-600">Category: {post.categoria}</p>
        <p className="mt-2 text-super-800 line-clamp-5">{post.conteudo}</p>
        <div className="mt-4 text-right text-super-500 text-sm">
          Posted by: {post.usuario}
        </div>
        {isOwner && (
          <button
            //onClick={() => router.push(`/edit/${post.id}`)}
            className="text-blue-600 hover:underline mr-4"
          >
            Edit (WIP)
          </button>
        )}
        {isOwner && (
          <button
            onClick={() => handleDelete(post.id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
