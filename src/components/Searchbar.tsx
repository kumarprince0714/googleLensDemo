"use client";
import { useState } from "react";
import ImagePreview from "./ImagePreview";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [searchMethod, setSearchMethod] = useState<"url" | "upload">("url");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (searchMethod === "url") {
      if (query.trim()) {
        onSearch(query.trim());
      }
    } else if (searchMethod === "upload" && file) {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload image");
        }

        // Use the returned URL for the search
        onSearch(data.url);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError(
          error instanceof Error ? error.message : "Failed to upload image"
        );
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          onClick={() => {
            setSearchMethod("url");
            setFile(null); // Clear file selection when switching modes
          }}
          className={`px-4 py-2 rounded-lg ${
            searchMethod === "url"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Image URL
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchMethod("upload");
            setQuery(""); // Clear URL input when switching modes
          }}
          className={`px-4 py-2 rounded-lg ${
            searchMethod === "upload"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Upload Image
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-2">
          {searchMethod === "url" ? (
            <input
              type="text"
              placeholder="Enter Image URL..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-3 border-gray-300 rounded-lg focus:outline-none border focus:ring-blue-500"
              required={searchMethod === "url"}
            />
          ) : (
            <div className="flex-1">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="flex-1 p-3 border-gray-300 rounded-lg focus:outline-none border focus:ring-blue-500 w-full"
                required={searchMethod === "upload"}
              />
              {file && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600 block mb-1">
                    Selected: {file.name}
                  </span>
                  <ImagePreview file={file} />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={
              isUploading ||
              (searchMethod === "upload" && !file) ||
              (searchMethod === "url" && !query.trim())
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg disabled:bg-blue-400 disabled:cursor-not-allowed max-h-12"
          >
            {isUploading ? "Uploading..." : "Search"}
          </button>
        </div>
        {uploadError && (
          <p className="text-red-500 text-sm mt-2">{uploadError}</p>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
