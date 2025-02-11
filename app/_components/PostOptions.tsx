"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

interface PostOptionsProps {
  postId: number;
  ownerId: string;
  onEdit: () => void;
  onDelete: () => void;
}

const PostOptions: React.FC<PostOptionsProps> = ({
  ownerId,
  onEdit,
  onDelete,
}) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []);
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  const isOwner = session?.user?.id === ownerId;
  const isAdmin = session?.user?.id === "1"; // Adjust this based on your user model

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu();
        }}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        ...
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-super-50 shadow-lg rounded-lg p-2">
          {isAdmin || isOwner ? (
            <>
              <button
                className="flex items-center p-2 w-full text-super-500 hover:bg-super-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                  toggleMenu();
                }}
              >
                ✏ Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  toggleMenu();
                }}
                className="flex items-center p-2 w-full text-super-500 hover:bg-super-100"
              >
                🗑 Delete
              </button>
            </>
          ) : null}
          <button
            onClick={() => alert("Reported!")}
            className="flex items-center p-2 w-full text-super-500 hover:bg-super-100"
          >
            🚩 Report
          </button>
        </div>
      )}
    </div>
  );
};

export default PostOptions;
