"use client";
import { getSession } from "next-auth/react";
import React, { useState } from "react";

interface CommenterProps {
  postId: number;
  onCommentPosted?: () => void; // Optional callback when comment is posted successfully
}

const Commenter: React.FC<CommenterProps> = ({ postId, onCommentPosted }) => {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!commentText.trim()) return;

    setLoading(true);
    try {
      const session = await getSession();
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Post: postId,
          Conteudo: commentText,
          Usuario: session.user.id,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to post comment");
      }

      // If posting is successful, clear the text field and notify parent to refresh comments
      setCommentText("");
      if (onCommentPosted) {
        onCommentPosted();
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-screen-sm mx-auto px-4">
      <div className="w-full max-w-screen-md mx-auto bg-super-50 border border-super-200 rounded-lg shadow-md p-4 mb-6  min-h-[200px] max-h-[400px] overflow-hidden">
        <form onSubmit={handleSubmit}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment here..."
            className="w-full p-2 border border-super-300 rounded mb-2 text-super-900"
            rows={3}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-super-500 hover:bg-super-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Commenter;
