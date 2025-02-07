"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "../_components/SideMenu";

interface Category {
  id: number;
  nome: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

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

  return (
    <>
      <SideMenu />
      <div className="p-4">
        <div className="grid grid-cols-5 gap-4">
          {/* Empty first column for spacing */}
          <div></div>

          {/* Categories in the remaining three columns */}
          <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 bg-super-100 hover:bg-super-200 rounded-lg shadow-md cursor-pointer"
                onClick={() => router.push(`/categories/${category.id}`)}
              >
                <h2 className="text-lg font-semibold">{category.nome}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
