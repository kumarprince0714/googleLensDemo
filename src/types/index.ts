// export interface VisualMatch {
//   position: number;
//   title?: string;
//   link?: string;
//   source?: string;
//   thumbnail?: string;
//   original?: string;
//   related_searches?: {
//     link: string;
//     query: string;
//     thumbnail: string;
//   }[];
// }

// export interface GoogleLensresult {
//   search_metadata?: {
//     id: string;
//     status: string;
//     created_at: string;
//     processed_at: string;
//     engine_url: string;
//     raw_html_file: string;
//     json_endpoint: string;
//   };

//   search_parameters?: {
//     engine: string;
//     url: string;
//   };

//   visual_matches?: VisualMatch[];
//   error?: string;
// }

//changes
export interface SearchInformation {
  images_results_state?: string;
  // Add any other fields that might be in the search_information object
}
export interface RelatedContent {
  query: string;
  link: string;
  thumbnail: string;
}

export interface VisualMatch {
  position: number;
  title?: string;
  link?: string;
  source?: string;
  source_icon?: string;
  thumbnail?: string;
  original?: string;
  related_searches?: {
    link: string;
    query: string;
    thumbnail: string;
  }[];

  // If Google returns additional dimensions or price info:
  actual_image_width?: number;
  actual_image_height?: number;
  price?: {
    value: string;
    currency: string;
  };

  // Additional metadata fields for product details
  description?: string;
  brand?: string;
  rating?: {
    value: number;
    count: number;
  };
  availability?: string;
  seller?: string;
  metadata?: Record<string, string>;
}

export interface ExactMatch {
  position: number;
  title?: string;
  link?: string;
  source?: string;
  source_icon?: string;
  thumbnail?: string;
  date?: string;
  actual_image_width?: number;
  actual_image_height?: number;

  // Additional metadata fields for product details
  description?: string;
  author?: string;
  website_name?: string;
  category?: string;
  metadata?: Record<string, string>;
}

export interface GoogleLensresult {
  search_metadata?: {
    id: string;
    status: string;
    created_at: string;
    processed_at: string;
    engine_url: string;
    raw_html_file: string;
    json_endpoint: string;
    page_token?: string; //Token for fetching Exact or Visual Matches page
  };

  search_parameters?: {
    engine: string;
    url: string;
    hl?: string;
    country?: string;

    page_token?: string; //Parameter when paginating
  };

  search_information?: SearchInformation;
  visual_matches?: VisualMatch[];
  related_content?: RelatedContent[];
  exact_matches?: ExactMatch[];
  error?: string;
}
