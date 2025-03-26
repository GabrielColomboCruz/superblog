"use client";
import { getSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { NotificationBell } from "./NotificationBell";

const Sidebar = () => {
  const [session, setSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      setSession(userSession);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    // Set sidebar open on desktop, closed on mobile
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!session) return <p>Loading...</p>;

  return (
    <>
      {/* Burger Button (Always Visible) */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-super-500 rounded-full text-white shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Sidebar Container (Above Everything) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white md:bg-opacity-100 bg-super-50 text-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col h-full`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold font-serif">
            <Link href="/">SuperBlog</Link>
          </h1>

          <NotificationBell userId={session.user.id} />
          {<button onClick={() => setIsOpen(false)}>✖</button>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <SearchBar />

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

            {/* <li>
              <form
                action="https://www.paypal.com/cgi-bin/webscr"
                method="post"
                target="_top"
              >
                <input type="hidden" name="cmd" value="_s-xclick" />
                <input
                  type="hidden"
                  name="hosted_button_id"
                  value="JA3QWWBNMC23L"
                />
                <input type="hidden" name="currency_code" value="BRL" />
                <input
                  type="image"
                  src="https://www.paypalobjects.com/pt_BR/i/btn/btn_subscribe_LG.gif"
                  name="submit"
                  title="O PayPal é a forma fácil e segura de pagar suas compras on-line."
                  alt="Assinar"
                />
              </form>
            </li> */}
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

      {/* Overlay for Mobile (Solid Background) */}
      {isMobile && isOpen && (
        <div className="fixed inset-0  bg-opacity-100 z-40"></div>
      )}
    </>
  );
};

export default Sidebar;
