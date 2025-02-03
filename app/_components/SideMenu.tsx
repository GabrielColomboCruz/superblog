"use client";
import { getSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [session, setSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      setSession(userSession);
    };
    fetchSession();
  }, []);

  if (!session) return <p>Loading...</p>;

  return (
    <>
      {/* Burger Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-super-500 rounded-full text-white shadow-lg md:hidden"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 h-screen z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:w-64 flex flex-col h-full`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold font-serif">
            <Link href="/">SuperBlog</Link>
          </h1>
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            ✖
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/categories"
                className="flex items-center gap-3 py-2 px-4 rounded hover:bg-super-200"
              >
                📂 Categories
              </Link>
            </li>
            <li>
              <Link
                href="/post"
                className="flex items-center gap-3 py-2 px-4 rounded hover:bg-super-200"
              >
                📝 Post
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 py-2 px-4 rounded hover:bg-super-200"
              >
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-3 py-2 px-4 rounded hover:bg-super-200"
              >
                👤 Profile
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Info and Sign Out */}
        <div className="p-4 border-t mt-auto">
          <p className="mb-2">Signed in as:</p>
          <p className="font-semibold">
            <Link href="/profile">{session.user.name}</Link>
          </p>
          <button
            onClick={() => signOut()}
            className="mt-4 w-full flex items-center justify-center bg-super-500 hover:bg-super-600 text-white py-2 px-4 rounded"
          >
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
