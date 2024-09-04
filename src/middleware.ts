import { validateRegister } from "./middlewares/validateRegister";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/api/auth/register")) {
    return validateRegister(req);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/register"],
};
