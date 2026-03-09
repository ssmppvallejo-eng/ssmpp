import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Solo interceptamos la raíz "/"
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/app", req.url));
    }
    return NextResponse.redirect(new URL("/landing", req.url));
  }

  return NextResponse.next();
}
