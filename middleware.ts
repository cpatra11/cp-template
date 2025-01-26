import { auth } from "@/auth";

const protectedRoutes = ["/dashboard", "/profile", "/settings"]; // Add your protected routes here
const paymentRequiredRoutes = ["/premium", "/exclusive-access"]; // Add your payment required routes here

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (
    !req.auth &&
    (protectedRoutes.includes(pathname) ||
      paymentRequiredRoutes.includes(pathname))
  ) {
    const newUrl = new URL("/sign-in", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  if (req.auth && (pathname === "/sign-in" || pathname === "/register")) {
    const newUrl = new URL("/dashboard", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  if (
    req.auth &&
    "hasAccess" in req.auth &&
    !req.auth.hasAccess &&
    paymentRequiredRoutes.includes(pathname)
  ) {
    const newUrl = new URL("/payment", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
