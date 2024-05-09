import { NextResponse } from "next/server";

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Origin": "*",
};

export function middleware(request) {
  console.log("middleware running");

  // Handle preflight requests
  const isPreflight = request.method === "OPTIONS";
  if (isPreflight) {
    return NextResponse.json({}, { headers: corsOptions });
  }

  // Handle simple requests
  const response = NextResponse.next();
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
