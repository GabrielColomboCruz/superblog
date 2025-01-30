"use client";
import { getSession, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      setSession(userSession);
    };

    fetchSession();
  }, []);

  if (!session) return <p>Loading...</p>;

  return (
    <div className="flex flex-col h-screen w-64 bg-gray-800 text-white fixed">
      {/* TopBar */}

      <div className="p-4">
        <h1 className="text-3xl font-extrabold font-serif">
          <Link href="/">SuperBlog</Link>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul>
          <li>
            <Link
              href="/categories"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              Categories
            </Link>
          </li>
          <li>
            <Link
              href="/post"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              Post
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              Profile
            </Link>
          </li>
        </ul>

        {/* Last Five Visits Placeholders */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Last Five Visits</h2>
          <ul>
            {[...Array(5)].map((_, index) => (
              <li key={index} className="py-1 px-2 bg-gray-700 rounded mb-2">
                Placeholder {index + 1}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User Info and Sign Out */}
      <div className="p-4">
        <p className="mb-2">Signed in as:</p>
        <p className="font-semibold">
          <Link href="/profile">{session.user.name}</Link>
        </p>
        <button
          onClick={() => signOut()}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
