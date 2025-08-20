import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function PaymentPage() {
  const session = await auth();

  // Redirect if not logged in
  if (!session) {
    redirect("/sign-in");
  }

  // If user has already paid, redirect to dashboard
  if (session?.user?.hasPaid) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Payment
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access to all features requires a subscription
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Premium Plan
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Get unlimited access to all features.
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                $9.99/month
              </p>
            </div>

            <form action="/api/create-payment" method="POST">
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Subscribe Now
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-xs text-gray-500 text-center">
                You&apos;ll be redirected to our payment provider to complete
                your subscription
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
