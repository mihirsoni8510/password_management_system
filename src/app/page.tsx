import LoginForm from "@/components/LoginForm";
import { redirect } from "next/navigation";
import { getUser } from "./actions/auth";

export default async function LoginPage() {
  const user = await getUser();

  if (user) {
    // ✅ user has a valid cookie -> send to dashboard
    redirect("/dashboard");
  }

  // ❌ no cookie/session -> show login form
  return <LoginForm />;
}
