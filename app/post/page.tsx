"use client";
import { useState, useEffect } from "react";
import { categoriasList } from "@/actions/categorias";
import { useSession } from "next-auth/react";
import { postsCreate } from "@/actions/post";
import { getSession } from "next-auth/react";
import Sidebar from "../_components/SideMenu";

const Post = async (Title, Conteudo, Category) => {
  try {
    const session = await getSession();
    const Usuario = session.user.id;
    const result = await postsCreate(Title, Conteudo, Usuario, Category);
    return;
  } catch (error) {
    console.error("Failed to post", error);
  }
};

const PostPage = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoriasList();
        setCategories(result);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  function search(formData) {
    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category");
    console.log("Titulo :", title);
    console.log("Conteudo :", content);
    console.log("category :", category);
    console.log("----------------\nAwait Post");
    Post(title, content, category);
  }

  return (
    <>
      <Sidebar />
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Create a Post</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent page reload
            const form = e.target as HTMLFormElement; // Explicitly cast to HTMLFormElement
            const formData = new FormData(form); // Get the form data
            search(formData); // Call the search function
          }}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {/* Title Input */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Content Input */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="content"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={5}
            />
          </div>

          {/* Category Dropdown */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
