import React from "react";
import Image from "next/image";
import { ExactMatch, VisualMatch } from "@/types";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: VisualMatch | ExactMatch | null;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  if (!isOpen || !product) return null;

  // Close modal when clicking outside the content
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Determine if product is VisualMatch to access type-specific properties
  const isVisualMatch = (
    item: VisualMatch | ExactMatch
  ): item is VisualMatch => {
    return "related_searches" in item || "original" in item;
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">
            {product.title || "Product Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          {product.thumbnail && (
            <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.thumbnail}
                alt={product.title || "Product image"}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Product Details */}
          <div className="space-y-4">
            {product.source && (
              <div>
                <h3 className="font-medium text-gray-700">Source</h3>
                <p>{product.source}</p>
              </div>
            )}

            {product.link && (
              <div>
                <h3 className="font-medium text-gray-700">Link</h3>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-words"
                >
                  {product.link}
                </a>
              </div>
            )}

            {product.description && (
              <div>
                <h3 className="font-medium text-gray-700">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Visual Match specific details */}
            {isVisualMatch(product) && (
              <>
                {product.price && (
                  <div>
                    <h3 className="font-medium text-gray-700">Price</h3>
                    <p className="text-green-600 font-medium">
                      {product.price.value} {product.price.currency}
                    </p>
                  </div>
                )}

                {product.brand && (
                  <div>
                    <h3 className="font-medium text-gray-700">Brand</h3>
                    <p>{product.brand}</p>
                  </div>
                )}

                {product.rating && (
                  <div>
                    <h3 className="font-medium text-gray-700">Rating</h3>
                    <div className="flex items-center">
                      <span className="text-amber-500">
                        {product.rating.value}/5
                      </span>
                      <span className="text-gray-500 ml-2">
                        ({product.rating.count} reviews)
                      </span>
                    </div>
                  </div>
                )}

                {product.availability && (
                  <div>
                    <h3 className="font-medium text-gray-700">Availability</h3>
                    <p>{product.availability}</p>
                  </div>
                )}

                {product.seller && (
                  <div>
                    <h3 className="font-medium text-gray-700">Seller</h3>
                    <p>{product.seller}</p>
                  </div>
                )}
              </>
            )}

            {/* Exact Match specific details */}
            {!isVisualMatch(product) && (
              <>
                {product.date && (
                  <div>
                    <h3 className="font-medium text-gray-700">Date</h3>
                    <p>{product.date}</p>
                  </div>
                )}

                {product.author && (
                  <div>
                    <h3 className="font-medium text-gray-700">Author</h3>
                    <p>{product.author}</p>
                  </div>
                )}

                {product.website_name && (
                  <div>
                    <h3 className="font-medium text-gray-700">Website</h3>
                    <p>{product.website_name}</p>
                  </div>
                )}

                {product.category && (
                  <div>
                    <h3 className="font-medium text-gray-700">Category</h3>
                    <p>{product.category}</p>
                  </div>
                )}
              </>
            )}

            {/* Common fields for both types */}
            {(product.actual_image_width || product.actual_image_height) && (
              <div>
                <h3 className="font-medium text-gray-700">Image Dimensions</h3>
                <p>
                  {product.actual_image_width || "N/A"} x{" "}
                  {product.actual_image_height || "N/A"}
                </p>
              </div>
            )}

            {/* Additional metadata if available */}
            {product.metadata && Object.keys(product.metadata).length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700">
                  Additional Details
                </h3>
                <div className="space-y-1">
                  {Object.entries(product.metadata).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2">
                      <span className="text-gray-500 capitalize">
                        {key.replace("_", " ")}
                      </span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related searches for Visual Matches */}
            {isVisualMatch(product) &&
              product.related_searches &&
              product.related_searches.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700">
                    Related Searches
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.related_searches.map((search, idx) => (
                      <li key={idx}>
                        <a
                          href={search.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {search.query}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {product.link && (
              <div className="pt-4">
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Visit Product Page
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
