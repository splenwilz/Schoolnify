import { NextRequest, NextResponse } from "next/server";
import { getStatesOfCountry } from "@countrystatecity/countries";

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country");
  if (!country) {
    return NextResponse.json({ error: "Missing country parameter" }, { status: 400 });
  }

  try {
    const states = await getStatesOfCountry(country);
    const result = (states || []).map((s) => ({
      iso2: s.iso2,
      name: s.name,
      timezone: s.timezone,
    }));
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, max-age=86400, immutable" },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
