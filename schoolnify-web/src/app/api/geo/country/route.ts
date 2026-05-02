import { NextRequest, NextResponse } from "next/server";
import { getCountryByCode } from "@countrystatecity/countries";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
  }
  try {
    const country = await getCountryByCode(code);
    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }
    // Return only fields used by location-picker
    const c = country as unknown as Record<string, unknown>;
    const { name, iso2, iso3, currency, currency_symbol, currency_name, timezones, phone_code } = c;
    return NextResponse.json(
      { name, iso2, iso3, currency, currency_symbol, currency_name, timezones, phone_code },
      { headers: { "Cache-Control": "public, max-age=86400, immutable" } },
    );
  } catch (err) {
    console.error("Failed to fetch country:", err);
    return NextResponse.json({ error: "Failed to load country details" }, { status: 500 });
  }
}
