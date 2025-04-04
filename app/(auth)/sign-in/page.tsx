import LoginForm from "@/components/auth/login-form";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const SignInPage = async () => {
  // Use getServerSession instead of auth() for more reliable server-side checks
  const session = await auth();

  // If already logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="xl:w-1/4 md:w-1/2 w-full px-10 sm:px-0">
      <LoginForm />
    </div>
  );
};

export default SignInPage;
