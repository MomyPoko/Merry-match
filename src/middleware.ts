import { validateRegister } from "./middlewares/validate_Register";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  // console.log("check request: ", req);

  if (url.pathname.startsWith("/api/auth/register")) {
    try {
      const response = await validateRegister(req);
      return response;
    } catch (error) {
      console.error("Error in validation middleware:", error);
      return new NextResponse("Validation failed.", { status: 400 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/register"],
};
