"use client";
import React from "react";

interface Comment {
  id: number;
  conteudo: string;
  usuario: string;
}

interface CommentProps {
  comment: Comment;
}

export default function Comment({ comment }: CommentProps) {
  return (
    <div className="w-full max-w-screen-sm mx-auto px-4">
      <div className="bg-super-50 border border-super-200 rounded-md shadow-sm p-4 mb-4">
        <p className="text-base text-super-800">{comment.conteudo}</p>
        <div className="mt-2 text-right text-super-500 text-sm">
          Posted by: {comment.usuario}
        </div>
      </div>
    </div>
  );
}
