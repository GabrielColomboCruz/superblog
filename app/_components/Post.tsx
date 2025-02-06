"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";

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
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const newSession = await getSession();
      setSession(newSession);
      console.log(
        "session : ",
        session,
        "\nsessionUserId : ",
        session?.user?.id,
        "\nPostUserId : ",
        post.usuario
      );
    };

    fetchSession();
  }, []);

  const isOwner = session?.user?.name === post.usuario;
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete post");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className=" w-full max-w-screen-sm mx-auto px-4 mt-4">
      <div className="w-full max-w-screen-md mx-auto bg-super-50 border border-super-200 rounded-lg shadow-md p-4 mb-6  min-h-[200px] max-h-[400px] overflow-hidden">
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
            onClick={() => router.push(`/edit/${post.id}`)}
            className="text-blue-600 hover:underline mr-4"
          >
            Edit
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
