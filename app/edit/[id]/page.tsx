"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSession } from "next-auth/react";
import Sidebar from "@/app/_components/SideMenu";

const EditPost = () => {
  const { id } = useParams();
  const router = useRouter();

  const [session, setSession] = useState(null);

  const [post, setPost] = useState({ titulo: "", conteudo: "", categoria: "" });
  const [oldPost, setOldPost] = useState({
    titulo: "",
    conteudo: "",
    categoria: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      setSession(userSession);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    if (!id) return;

    // Fetch post data
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts?id=${id}`);
        const data = await res.json();
        setPost({
          titulo: data[0]?.titulo || "",
          conteudo: data[0]?.conteudo || "",
          categoria: data[0]?.categoria || "",
        });
        setOldPost({
          titulo: data[0]?.titulo || "",
          conteudo: data[0]?.conteudo || "",
          categoria: data[0]?.categoria || "",
        });
      } catch (err) {
        setError("Failed to load post.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchPost();
    fetchCategories();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category");
    try {
      //console.log(title, content, category);
      const res = await fetch(`/api/posts`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          action: "update",
          Id: id,
          Titulo: title,
          Conteudo: content,
          Categoria: category,
        }),
      });

      if (res.ok) {
        const res = await fetch(`/api/editedposts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({
            action: "create",
            Titulo: oldPost.titulo,
            Conteudo: oldPost.conteudo,
            Usuario: session.user.id,
            Categoria: category,
            Post: id,
          }),
        });
        console.log(res);

        if (res.ok) {
          alert("Post updated successfully!");
          router.push(`/specificPost/${id}`);
        }
      } else {
        setError("Failed to update post.");
      }
    } catch {
      setError("An error occurred while updating.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Sidebar />
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-super-500">Edit Post</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-super-50 shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-super-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="shadow border rounded w-full py-2 px-3 text-super-700 focus:outline-none focus:shadow-outline"
              value={post.titulo}
              onChange={(e) => setPost({ ...post, titulo: e.target.value })}
              required
            />
          </div>

          {/* Content Input */}
          <div className="mb-4">
            <label className="block text-super-700 text-sm font-bold mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              className="shadow border rounded w-full py-2 px-3 text-super-700 focus:outline-none focus:shadow-outline"
              rows={5}
              value={post.conteudo}
              onChange={(e) => setPost({ ...post, conteudo: e.target.value })}
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="mb-4">
            <label className="block text-super-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="shadow border rounded w-full py-2 px-3 text-super-700 focus:outline-none focus:shadow-outline"
              value={post.categoria}
              onChange={(e) => setPost({ ...post, categoria: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-super-500 hover:bg-super-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPost;
