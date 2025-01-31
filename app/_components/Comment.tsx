"use client";
import Link from "next/link";
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
    <div className="flex justify-center">
      <div className="max-w-[50ch] p-4 text-center">
        <div className="border p-4 mb-4 shadow-md">
          <h2 className="text-xl font-bold">{comment.conteudo}</h2>
          <p className="text-sm text-gray-500">Posted by: {comment.usuario}</p>
        </div>
      </div>
    </div>
  );
}
