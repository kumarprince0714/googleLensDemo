"use client";

import {
  ExactMatch,
  GoogleLensresult,
  RelatedContent,
  VisualMatch,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState, useEffect } from "react";
import ProductDetailsModal from "@/components/ProductDetailsModal";

interface ResultDisplayProps {
  query: string;
}

const ResultsDisplay: React.FC<ResultDisplayProps> = ({ query }) => {
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    VisualMatch | ExactMatch | null
  >(null);

  // Reset pageToken when query changes
  useEffect(() => {
    setPageToken(null);
  }, [query]);

  const openModal = (product: VisualMatch | ExactMatch) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchResults = async () => {
    console.log(`Fetching results for image URL: ${query}`);
    const tokenParam = pageToken
      ? `&pageToken=${encodeURIComponent(pageToken)}`
      : "";
    const url = `/api/search?imageUrl=${encodeURIComponent(
      query
    )}${tokenParam}`;
    console.log(`Making request to: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch results");
    }
    return response.json();
  };

  const { data, isLoading, isError, error, refetch } =
    useQuery<GoogleLensresult>({
      queryKey: ["googleLens", query, pageToken],
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
        <p className="text-red-600">Error: {(error as Error).message}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  console.log("Full data received:", data);

  // Handle the case when there are no results but the API call was successful
  if (
    data.error === "Google Lens hasn't returned any results for this query." ||
    data.search_information?.images_results_state === "Fully empty"
  ) {
    return (
      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-semibold text-yellow-700">
          No Results Found
        </h2>
        <p className="mt-2 text-yellow-600">
          Google Lens cannot find any matches for this image. Try using a
          different image or one from a public source.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      {/* Visual Matches */}
      {data.visual_matches && data.visual_matches.length > 0 && (
        <>
          <h2 className="text-xl font-semibold">Visual Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.visual_matches.map((match: VisualMatch, idx: number) => (
              <div
                key={idx}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openModal(match)}
              >
                {match.thumbnail && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={match.thumbnail}
                      alt={match.title || ""}
                      fill
                      className="object-cover"
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
                  {match.price && (
                    <p className="text-sm font-medium text-green-600">
                      {match.price.value} {match.price.currency}
                    </p>
                  )}
                  <button
                    className="text-blue-600 hover:underline text-sm mt-2 block"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(match);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Related Content */}
      {data.related_content && data.related_content.length > 0 && (
        <>
          <h2 className="text-xl font-semibold">Related Content</h2>
          <ul className="list-disc pl-5">
            {data.related_content.map((item: RelatedContent, idx: number) => (
              <li key={idx} className="mb-2">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {item.query}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Exact Matches & Pagination */}
      {data.exact_matches && data.exact_matches.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold">Exact Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.exact_matches.map((match: ExactMatch, idx: number) => (
              <div
                key={idx}
                className="p-4 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => openModal(match)}
              >
                {match.thumbnail && (
                  <div className="relative h-40 w-full mb-3">
                    <Image
                      src={match.thumbnail}
                      alt={match.title || ""}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <h3 className="font-medium">{match.title || "No title"}</h3>
                {match.date && (
                  <p className="text-sm text-gray-500 mt-1">{match.date}</p>
                )}
                <button
                  className="text-blue-600 hover:underline mt-2 block"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(match);
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </>
      ) : data.search_metadata?.page_token ? (
        <button
          onClick={() => {
            setPageToken(data.search_metadata!.page_token!);
            refetch();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Load Exact Matches
        </button>
      ) : null}

      {/* No content message when API returned successfully but no specific matches */}
      {(!data.visual_matches || data.visual_matches.length === 0) &&
        (!data.related_content || data.related_content.length === 0) &&
        (!data.exact_matches || data.exact_matches.length === 0) &&
        !data.search_metadata?.page_token &&
        !data.error && (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No visual matches, related content or exact matches were found.
            </p>
          </div>
        )}

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default ResultsDisplay;
