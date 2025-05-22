// Standard SerpAPI metadata interfaces
export interface SearchMetadata {
  id: string;
  status: string;
  json_endpoint: string;
  created_at: string;
  processed_at: string;
  google_lens_url: string;
  raw_html_file: string;
  page_token?: string;
}

export interface SearchParameters {
  engine: string;
  url: string;
  hl?: string;
  gl?: string;
  page_token?: string;
}

export interface SearchInformation {
  images_results_state?: string;
}

// Core result interfaces based on SerpAPI documentation
export interface VisualMatch {
  position: number;
  title: string;
  link: string;
  source: string;
  source_icon?: string;
  thumbnail: string;
  original?: string;
  price?: {
    value: string;
    currency: string;
    extracted_value?: number;
  };
}

export interface ExactMatch {
  position: number;
  title: string;
  link: string;
  source: string;
  source_icon?: string;
  thumbnail: string;
  date?: string;
}

export interface RelatedContent {
  query: string;
  link: string;
  thumbnail: string;
}

// Main response interface
export interface GoogleLensresult {
  search_metadata?: SearchMetadata;
  search_parameters?: SearchParameters;
  search_information?: SearchInformation;
  visual_matches?: VisualMatch[];
  exact_matches?: ExactMatch[];
  related_content?: RelatedContent[];
  error?: string;
}
