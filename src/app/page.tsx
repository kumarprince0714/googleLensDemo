"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SearchBar from "@/components/Searchbar";
import ResultsDisplay from "@/components/ResultsDisplay";

const queryClient = new QueryClient();

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSubmitted(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-500">
          Google lens API demo
        </h1>
        <div className="w-full max-w-2xl">
          <SearchBar onSearch={handleSearch} />
          {isSubmitted && <ResultsDisplay query={searchQuery} />}
        </div>
      </div>
    </QueryClientProvider>
  );
}
