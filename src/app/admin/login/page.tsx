import Link from "next/link";
import { SubmitButton } from "@/components/ui/submit-button";
import { Logo } from "@/components/logo";
import { signIn, signOut } from "./actions";

export const metadata = { title: "Sign in" };

type Props = {
  searchParams: Promise<{
    error?: string;
    next?: string;
    signout?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  if (sp.signout === "1") {
    await signOut();
  }
  const error = sp.error;
  const next = sp.next ?? "/admin";

  return (
    <div className="min-h-screen flex items-center justify-center py-16 bg-navy-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-navy-100 shadow-sm p-8 md:p-10">
        <Link href="/" className="inline-flex">
          <Logo variant="navy" />
        </Link>
        <h1 className="mt-8 text-2xl font-medium text-navy-950 tracking-tight">
          Sign in to Polaris
        </h1>
        <p className="mt-2 text-sm text-navy-600">
          For Polaris team members and administrators.
        </p>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error === "invalid"
              ? "Wrong username or password."
              : "Please enter your username and password."}
          </div>
        )}

        <form action={signIn} className="mt-8 space-y-5">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              className="w-full h-11 px-4 rounded-xl border border-navy-200 field-focus focus:outline-none focus:border-navy-900"
            />
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label className="block text-sm font-medium text-navy-900">
                Password
              </label>
            </div>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full h-11 px-4 rounded-xl border border-navy-200 field-focus focus:outline-none focus:border-navy-900"
            />
          </div>

          <SubmitButton
            variant="primary"
            size="lg"
            className="w-full"
            pendingLabel="Signing in…"
          >
            Sign in
          </SubmitButton>
        </form>

        <p className="mt-8 text-xs text-navy-500 text-center">
          Not a Polaris team member? You probably want our{" "}
          <Link href="/join#form" className="underline">
            contact form
          </Link>{" "}
          instead.
        </p>
      </div>
    </div>
  );
}
