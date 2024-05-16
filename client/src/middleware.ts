export { default } from "next-auth/middleware";



export const config = {
  matcher: [
    // "/dashoard/(.*)/edit/(.*)",
    "/dashboard/:path*/edit/:path*",
    "/dashboard/:path*/add/:path*",

  ]
};
