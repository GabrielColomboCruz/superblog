"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Post from "@/app/_components/Post";
import Comment from "@/app/_components/Comment";
import Commenter from "@/app/_components/Commenter";
import Sidebar from "@/app/_components/SideMenu";

const PostPage = () => {
  const { id } = useParams(); // Get post ID from the URL
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  // Fetch post data
  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts?Id=${id}`);
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
  const fetchComments = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/comment?Post=${id}`);
      const data = await res.json();
      setComments(data.result);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

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
