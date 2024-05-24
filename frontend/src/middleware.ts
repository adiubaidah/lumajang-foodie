import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const access_token = request.cookies.get("access_token");
  if (!access_token) {
    return NextResponse.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_DOMAIN_URL)
    );
  } else {
    try {
      const isLogin = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URL + "/auth/is-auth",
        {
          method: "POST",
          cache: "no-store",
          body: JSON.stringify({
            access_token,
          }),
        }
      );
    } catch (err) {
      return NextResponse.redirect(
        new URL("/", process.env.NEXT_PUBLIC_DOMAIN_URL)
      );
    }
    return NextResponse.next();
  }
}

//explain this code
export const config = {
  matcher: ["/manage/:path*"],
};
