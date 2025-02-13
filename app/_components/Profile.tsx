"use client";
import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Post from "./Post";

interface PostData {
  id: number;
  titulo: string;
  conteudo: string;
  categoria: string;
  usuario: string;
  usuario_id: string;
}

interface ProfileViewerProps {
  userId?: string | string[];
}

const ProfileViewer: React.FC<ProfileViewerProps> = ({ userId }) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      setSession(userSession.user.id);
    };

    fetchSession();
  }, []);
  const userIdToFetch = userId || session;

  useEffect(() => {
    if (!userIdToFetch) return; // Avoid fetching if there's no user

    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts?usuario=${userIdToFetch}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts for user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userIdToFetch]);

  if (!session) return <p>Please log in to view this profile.</p>;
  if (loading) return <p>Loading...</p>;
  if (!posts.length) return <p>No posts found for this user.</p>;

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default ProfileViewer;
