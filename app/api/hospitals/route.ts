import { NextRequest, NextResponse } from "next/server";

function getTagValue(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
  return match?.[1] ?? "";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;

  if (!lat || !lng) {
    return NextResponse.json({ error: "위치 없음" }, { status: 400 });
  }

  if (!serviceKey) {
    return NextResponse.json({ error: "API 키 없음" }, { status: 500 });
  }

  const url = new URL(
    "https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytListInfoInqire"
  );

  url.searchParams.set("serviceKey", serviceKey);
  url.searchParams.set("WGS84_LON", lng);
  url.searchParams.set("WGS84_LAT", lat);
  url.searchParams.set("numOfRows", "1000");
  url.searchParams.set("pageNo", "1");

  const res = await fetch(url.toString(), { cache: "no-store" });
  const xml = await res.text();

  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  const hospitals = itemMatches.map((item) => ({
  id: getTagValue(item, "hpid"),
  name: getTagValue(item, "dutyName"),
  address: getTagValue(item, "dutyAddr"),
  phone: getTagValue(item, "dutyTel3") || getTagValue(item, "dutyTel1"),
  lat: Number(getTagValue(item, "wgs84Lat")),
  lng: Number(getTagValue(item, "wgs84Lon")),
  canThrombectomy:
    getTagValue(item, "dutyName").includes("대학") ||
    getTagValue(item, "dutyName").includes("의료원") ||
    getTagValue(item, "dutyName").includes("센터"),
}));
  return NextResponse.json({ hospitals });
}