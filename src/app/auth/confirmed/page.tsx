import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Confirmed | Spotter Tools Pro",
  description: "Your Spotter Tools Pro account email has been confirmed.",
  // This is a transactional landing page for the confirmation email link,
  // keep it out of search results.
  robots: { index: false, follow: false },
};

export default function EmailConfirmedPage() {
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-6 pt-32 pb-24 text-center">
      <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-green/40 bg-brand-green/15">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-brand-green"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <h1 className="mb-3 text-3xl font-bold">Email confirmed</h1>

      <p className="mb-8 max-w-md text-muted leading-relaxed">
        Your <strong className="text-foreground">Spotter Tools Pro</strong>{" "}
        account is verified. Head back to the app and sign in with your email
        and password, you&apos;re all set. You can close this tab.
      </p>

      <a
        href="/"
        className="rounded-lg border border-white/10 bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand-teal/60"
      >
        Back to spottertoolspro.com
      </a>
    </main>
  );
}
