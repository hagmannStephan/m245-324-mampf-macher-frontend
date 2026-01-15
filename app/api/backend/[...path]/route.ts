import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://83.228.192.104:18081";

async function forward(req: NextRequest, pathSegments: string[]) {
  const incomingUrl = new URL(req.url);
  const path = pathSegments.join("/");
  const targetUrl = `${BACKEND_URL}/${path}${incomingUrl.search}`;

  const res = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "content-type": req.headers.get("content-type") ?? "",
    },
    cache: "no-store",
  });

  const body = await res.arrayBuffer();

  const headers = new Headers();
  const contentType = res.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  return new NextResponse(body, { status: res.status, headers });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return forward(req, path);
}
