//route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams; //req.nextUrl.searchParams retrieves the URL's query parameters as a URLSearchParams object.

  const imageUrl = searchParams.get("imageUrl"); //searchParams.get('imageUrl') extracts the value for the imageUrl parameter from the query string.

  const hl = searchParams.get("hl") || "en";

  console.log("Received image URL:", imageUrl);

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is required" });
  }

  const apiKey = process.env.SERP_API_KEY; //retrieves the value of the environment variable SERP_API_KEY(the one set in our environment)

  //change
  // console.log("API Key first 4 chars:", apiKey?.substring(0, 4));

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is not configured" },
      { status: 500 }
    );
  }

  // support an optional pageToken for pagination / Exact Matches
  const pageToken = searchParams.get("pageToken");

  //Build query params
  const params = new URLSearchParams({
    engine: "google_lens",
    url: imageUrl,
    api_key: apiKey,
    hl,
  });

  if (pageToken) {
    params.set("page_token", pageToken); //Pulls next set of results (exact or next Visual matches) :contentReference[oaicite:4]{index=4}
  }

  const serpApiUrl = `https://serpapi.com/search.json?${params.toString()}`;
  console.log(
    "Full SerpAPI request URL (redacted key):",
    serpApiUrl.replace(apiKey, "REDACTED_KEY")
  );

  try {
    console.log("Making request to SerpAPI...");
    const response = await fetch(serpApiUrl);
    console.log("Response status:", response.status);

    const data = await response.json();
    console.log(
      "Response data:",
      JSON.stringify(data).substring(0, 200) + "..."
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch data from Serp API" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log("Error fetching data from Google Lens API", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data from Google Lens API",
      },
      { status: 500 }
    );
  }
}
