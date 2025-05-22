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
    return "original" in item; // Only check for 'original' since it's documented
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

            {product.source_icon && (
              <div>
                <div className="relative h-8 w-8">
                  <Image
                    src={product.source_icon}
                    alt="Source icon"
                    fill
                    className="object-contain"
                  />
                </div>
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

                {product.original && (
                  <div>
                    <h3 className="font-medium text-gray-700">
                      Original Image
                    </h3>
                    <a
                      href={product.original}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-words text-sm"
                    >
                      View Original
                    </a>
                  </div>
                )}
              </>
            )}

            {/* Exact Match specific details */}
            {!isVisualMatch(product) && product.date && (
              <div>
                <h3 className="font-medium text-gray-700">Date</h3>
                <p>{product.date}</p>
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
                  Visit Page
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
