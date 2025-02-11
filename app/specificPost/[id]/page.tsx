"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Post from "@/app/_components/Post";
import Comment from "@/app/_components/Comment";
import Commenter from "@/app/_components/Commenter";
import Sidebar from "@/app/_components/SideMenu";

interface CommentType {
  id: number;
  conteudo: string;
  categoria: string;
  usuario: string;
}

interface Post {
  id: number;
  titulo: string;
  conteudo: string;
  categoria: string;
  usuario: string;
  usuario_id: string;
}

const PostPage = () => {
  const { id } = useParams(); // Get post ID from the URL
  const [post, setPost] = useState<Post>(null);
  const [comments, setComments] = useState<CommentType[]>([]);

  // Fetch post data
  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts?id=${id}`);
        const data = await res.json();
        //console.log(data);
        setPost(data[0]);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/comment?Post=${id}`);
      const data = await res.json();
      setComments(data.result);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [id]); // Add id to the dependency array

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  if (!post) return <p>Loading post...</p>;

  return (
    <div>
      <Sidebar />
      <Post post={post} />
      <div>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      <Commenter postId={Number(id)} onCommentPosted={fetchComments} />
    </div>
  );
};

export default PostPage;
