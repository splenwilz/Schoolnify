import { NextResponse } from "next/server";
import { getCountries } from "@countrystatecity/countries";

// Cache the countries response since it's static data
let cached: unknown = null;

export async function GET() {
  try {
    if (!cached) {
      const countries = await getCountries();
      cached = countries.map((c) => ({
        iso2: c.iso2,
        name: c.name,
        currency: c.currency,
        currency_name: c.currency_name,
        currency_symbol: c.currency_symbol,
        emoji: c.emoji,
      }));
    }
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, max-age=86400, immutable" },
    });
  } catch (err) {
    console.error("Failed to fetch countries:", err);
    return NextResponse.json({ error: "Failed to load countries" }, { status: 500 });
  }
}
