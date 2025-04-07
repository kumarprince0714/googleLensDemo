export interface VisualMatch {
  position: number;
  title?: string;
  link?: string;
  source?: string;
  thumbnail?: string;
  original?: string;
  related_searches?: {
    link: string;
    query: string;
    thumbnail: string;
  }[];
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
  };

  search_parameters?: {
    engine: string;
    url: string;
  };

  visual_matches?: VisualMatch[];
  error?: string;
}
