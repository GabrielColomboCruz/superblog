"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Post from "../_components/Post";
import Sidebar from "../_components/SideMenu";
import { useRouter } from "next/navigation";

const Doomscroller = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Track if more posts exist
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch posts from API
  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    console.log("Fetching posts at offset:", offset);
    console.log("Fetching posts: Begin");
    await new Promise((resolve) => setTimeout(resolve, 1));
    console.log("Fetching posts: End");

    try {
      const res = await fetch(`/api/posts?limit=10&offset=${offset}`);
      if (!res.ok) throw new Error("Failed to fetch posts");

      const newPosts = await res.json();

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        console.log(newPosts);
        setPosts((prev) => [...prev, ...newPosts]);
        setTimeout(() => setOffset((prev) => prev + 10), 1);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setTimeout(() => setLoading(false), 1);
    }
  }, [loading, hasMore, offset]);

  useEffect(() => {
    if (!hasMore) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !loading) {
        setTimeout(() => fetchPosts(), 1);
      }
    };

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "100px",
      threshold: 1.0,
    });

    const sentinel = document.getElementById("scroll-sentinel");
    if (sentinel) observer.current.observe(sentinel);

    return () => observer.current?.disconnect();
  }, [fetchPosts, loading, hasMore, offset]); // Depend on `hasMore` to prevent infinite fetches

  return (
    <>
      <Sidebar></Sidebar>

      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => router.push(`/specificPost/${post.id}`)}
          className=""
        >
          <Post post={post} />
        </div>
      ))}
      <div id="scroll-sentinel" style={{ height: "1px" }}></div>
      {loading && <p>Loading...</p>}
    </>
  );
};

export default Doomscroller;
