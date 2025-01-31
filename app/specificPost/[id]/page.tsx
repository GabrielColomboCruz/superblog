"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostData from "@/app/_components/PostData";
import Comment from "@/app/_components/Comment";
import Sidebar from "@/app/_components/SideMenu";

const PostPage = () => {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!id) return;

    // Fetch post details
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/?Id=${id}`);
        const data = await res.json();

        setPost(data[0]);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    // Fetch comments
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment?Post=${id}`);
        const data = await res.json();
        setComments(data.result);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);
  console.log(post);
  if (!post) return <p>Loading post...</p>;

  return (
    <div>
      <Sidebar />
      <PostData post={post} />
      <div>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default PostPage;
