"use client";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Sidebar from "../_components/SideMenu";

const PostPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const result = await response.json();
        setCategories(result);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category");
    try {
      const session = await getSession();
      if (!session) throw new Error("User not authenticated");
      form.classList.add("opacity-50");
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          Titulo: title,
          Conteudo: content,
          Usuario: session.user.id,
          Categoria: category,
        }),
      });
      if (!response.ok) throw new Error("Failed to create post");
      form.reset();
      alert("Post created successfully!");
      form.classList.remove("opacity-50");
    } catch (error) {
      console.error("Failed to post", error);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-super-500">
          Create a Post
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-super-50 shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {/* Title Input */}
          <div className="mb-4">
            <label
              className="block text-super-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="shadow border rounded w-full py-2 px-3 text-super-700 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Content Input */}
          <div className="mb-4">
            <label
              className="block text-super-700 text-sm font-bold mb-2"
              htmlFor="content"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              className="shadow border rounded w-full py-2 px-3 text-super-700 focus:outline-none focus:shadow-outline"
              rows={5}
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="mb-4">
            <label
              className="block text-super-700 text-sm font-bold mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              className="shadow border rounded w-full py-2 px-3 text-super-700 focus:outline-none focus:shadow-outline"
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostPage;
