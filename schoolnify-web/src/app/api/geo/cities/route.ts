import { NextRequest, NextResponse } from "next/server";
import { getCitiesOfState } from "@countrystatecity/countries";

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country");
  const state = request.nextUrl.searchParams.get("state");
  if (!country || !state) {
    return NextResponse.json({ error: "Missing country or state parameter" }, { status: 400 });
  }

  try {
    const cities = await getCitiesOfState(country, state);
    const result = (cities || []).map((c) => ({
      name: c.name,
      timezone: c.timezone,
    }));
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, max-age=86400, immutable" },
    });
  } catch (err) {
    console.error("Failed to fetch cities:", err);
    return NextResponse.json({ error: "Failed to load cities" }, { status: 500 });
  }
}
