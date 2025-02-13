"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  type: "post" | "user" | "category";
  Id: string;
  Nome: string;
  Descricao?: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch search results
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 700);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setQuery(""); // Clear input after selection

    switch (result.type) {
      case "post":
        router.push(`/specificPost/${result.Id}`);
        break;
      case "user":
        router.push(`/profile/${result.Id}`);
        break;
      case "category":
        router.push(`/categories/${result.Id}`);
        break;
      default:
        console.warn("Unknown result type:", result.type);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-super-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-super-500"
      />

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full bg-super-50 border border-super-200 rounded-md shadow-lg mt-1">
          {results.map((result) => (
            <div
              key={result.Id}
              onClick={() => handleResultClick(result)}
              className="p-2 hover:bg-super-100 cursor-pointer flex flex-col"
            >
              <span className="font-semibold">{result.Nome}</span>
              {result.Descricao && (
                <span className="text-sm text-super-500">
                  {result.Descricao}
                </span>
              )}
              <span className="text-xs text-super-400 uppercase">
                {result.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
