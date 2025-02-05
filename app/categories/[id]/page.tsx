"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SideMenu from "@/app/_components/SideMenu";
import Post from "@/app/_components/Post";

import { useRouter } from "next/navigation";
interface PostProps {
  post: {
    id: number;
    titulo: string;
    conteudo: string;
    categoria: string;
    usuario: string;
  };
}

export default function CategoryDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?category=${id}`);
        if (!response.ok) throw new Error("Failed to fetch posts");
        const result = await response.json();
        setPosts(result);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPosts();
  }, [id]);

  return (
    <>
      <SideMenu />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Posts in Category {id}</h1>
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No posts found in this category.</p>
        ) : (
          <div>
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => router.push(`/specificPost/${post.id}`)}
                className=""
              >
                <Post post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
