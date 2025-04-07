import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams; //req.nextUrl.searchParams retrieves the URL's query parameters as a URLSearchParams object.

  const imageUrl = searchParams.get("imageUrl"); //searchParams.get('imageUrl') extracts the value for the imageUrl parameter from the query string.

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is required" });
  }

  const apiKey = process.env.SERP_API_KEY; //retrieves the value of the environment variable SERP_API_KEY(the one set in our environment)

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_lens&url=${encodeURIComponent(
        imageUrl
      )}&api_key=${apiKey}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch data from Serp API" },
        { status: response.status }
      );
    }

    const data = await response.json(); //parsing a successful response
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
