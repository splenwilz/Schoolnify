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
    return NextResponse.json(country, {
      headers: { "Cache-Control": "public, max-age=86400, immutable" },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
