"use client";

import { GoogleLensresult } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface ResultDisplayProps {
  query: string;
}

const ResultsDisplay: React.FC<ResultDisplayProps> = ({ query }) => {
  const fetchResults = async () => {
    const response = await fetch(
      `/api/search?imageUrl=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch results");
    }
    return response.json();
  };

  const { data, isLoading, isError, error } = useQuery<GoogleLensresult>({
    queryKey: ["googleLens", query],
    queryFn: fetchResults,
    enabled: !!query,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center mt-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 p-4 rounded-lg mt-4">
        <p className="text-red-600">Error:{(error as Error).message}</p>
      </div>
    );
  }

  if (!data || !data.visual_matches) {
    return null;
  }

  return (
    <div className=" mt-8">
      <h2 className="text-xl font-semibold mb-4">Search Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.visual_matches.map((match, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {match.thumbnail && (
              <div className="relative h-48 w-full">
                <Image
                  src={match.thumbnail}
                  alt={match.title || "Search result"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-medium text-lg truncate">
                {match.title || "No title"}
              </h3>
              {match.source && (
                <p className="text-sm text-gray-500">{match.source}</p>
              )}
              {match.link && (
                <a
                  href={match.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-2 block"
                >
                  {" "}
                  View Source{" "}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ResultsDisplay;
