"use client";
import { useState, useEffect, useRef } from "react";
import PostData from "../_components/PostData";
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
  const fetchPosts = async () => {
    if (loading || !hasMore) return; // Prevent unnecessary fetches

    setLoading(true);
    console.log("Fetching posts at offset:", offset);
    console.log("Fetching posts: Begin");
    await new Promise((resolve) => setTimeout(resolve, 1)); // Delay fetchPosts
    console.log("Fetching posts: End");
    try {
      const res = await fetch(`/api/posts?limit=10&offset=${offset}`);
      if (!res.ok) throw new Error("Failed to fetch posts");

      const newPosts = await res.json();

      if (newPosts.length === 0) {
        setHasMore(false); // No more posts to load
      } else {
        console.log(newPosts);
        setPosts((prev) => [...prev, ...newPosts]); // Append new posts
        console.log("Apend posts: begin");
        setTimeout(() => setOffset((prev) => prev + 10), 1); // Delay offset update
        console.log("Apend posts: End");
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      console.log("finallt Timeout: begin");
      setTimeout(() => setLoading(false), 1); // Delay loading state reset
      console.log("finallt Timeout: end");
    }
  };

  // Observer to trigger fetch when scrolling near bottom
  useEffect(() => {
    if (!hasMore) return; // Stop observing when there are no more posts

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !loading) {
        console.log("Observer Timeout:");
        setTimeout(() => fetchPosts(), 1); // Add delay before fetching
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
  }, [posts, offset, hasMore]); // Depend on `hasMore` to prevent infinite fetches

  return (
    <div>
      <Sidebar></Sidebar>

      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => router.push(`/specificPost/${post.id}`)}
        >
          <PostData post={post} />
        </div>
      ))}
      <div id="scroll-sentinel" style={{ height: "1px" }}></div>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Doomscroller;
