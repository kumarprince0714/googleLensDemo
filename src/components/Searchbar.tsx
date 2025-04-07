"use client";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Enter Image URL..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 border-gray-300 rounded-lg focus:outline-none border focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
        >
          Search
        </button>
      </div>
    </form>
  );
};
export default SearchBar;
