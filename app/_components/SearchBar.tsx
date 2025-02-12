"use client";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  // Debounce effect to delay search execution
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(query);
    }, 700);

    return () => clearTimeout(delayDebounce);
  }, [query, onSearch]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-super-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-super-500"
      />
    </div>
  );
};

export default SearchBar;
