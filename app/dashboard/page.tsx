import { useEffect, useState } from "react";

const limit = 10; // How many posts to load at a time

export default function PostList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts function
  const loadPosts = async () => {
    if (loading || !hasMore) return; // Avoid multiple requests

    setLoading(true);
    try {
      const res = await fetch(`/api/posts?limit=${limit}&offset=${offset}`);
      const newPosts = await res.json();

      setPosts((prev) => [...prev, ...newPosts]); // Append new posts
      setOffset((prev) => prev + limit); // Increase offset

      if (newPosts.length < limit) {
        setHasMore(false); // No more posts to load
      }
    } catch (error) {
      console.error("Failed to load posts", error);
    }
    setLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    loadPosts();
  }, []);

  // Infinite scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !loading
      ) {
        loadPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="p-4 border-b">
          <h2 className="text-xl font-bold">{post.titulo}</h2>
          <p className="text-sm text-gray-500">Category: {post.categoria}</p>
          <p className="text-sm text-gray-500">Posted by: {post.usuario}</p>
          <p className="mt-2">{post.conteudo}</p>
        </div>
      ))}
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more posts.</p>}
    </div>
  );
}
