import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Get token with user data
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log(
    `Middleware auth check for ${request.nextUrl.pathname}:`,
    token ? "Authenticated" : "Not authenticated"
  );

  const { pathname } = request.nextUrl;

  // Pages that don't require payment verification
  const paymentExemptPages = [
    "/dashboard",
    "/profile",
    "/payment",
    "/api",
    "/sign-in",
    "/register",
    "/pricing",
    "/cancel",
  ];
  const isPaymentExemptPage = paymentExemptPages.some((page) =>
    pathname.startsWith(page)
  );

  // Auth redirect - If authenticated user tries to access sign-in page
  if (token && (pathname === "/" || pathname === "/sign-in")) {
    // uncommment the payment things and remove the dashboard from the payment exempt pages
    // Check payment status before redirecting to dashboard
    // if (token.hasPaid !== true && !isPaymentExemptPage) {
    //   // User is logged in but hasn't paid - redirect to payment
    //   console.log(
    //     "User authenticated but payment required, redirecting to payment"
    //   );
    //   const url = request.nextUrl.clone();
    //   url.pathname = "/payment";
    //   return NextResponse.redirect(url);
    // }

    // // User is logged in and has paid - redirect to dashboard
    // console.log(
    //   "User authenticated and payment verified, redirecting to dashboard"
    // );
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Payment check - If authenticated but not paid, redirect to payment page
  if (token && token.hasPaid !== true && !isPaymentExemptPage) {
    console.log("Payment required, redirecting to payment page");
    const url = request.nextUrl.clone();
    url.pathname = "/payment";
    return NextResponse.redirect(url);
  }

  // Auth protection - If not authenticated, redirect to sign-in
  if (
    !token &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/bhalus"))
  ) {
    console.log("Authentication required, redirecting to sign-in");
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Add routes you want middleware to run on
    "/",
    "/sign-in",
    "/dashboard/:path*",
    "/profile/:path*",
    "/bhalus/:path*",
    "/payment",
    // Add any other paths you want to protect or check payments for
  ],
};
