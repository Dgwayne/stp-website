import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Your Account — Spotter Tools Pro",
  description:
    "How to delete your Spotter Tools Pro account and the associated data, in the app or by request.",
};

export default function DeleteAccountPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <h1 className="mb-2 text-4xl font-bold">Delete Your Account</h1>
      <p className="mb-10 text-sm text-muted">
        for <strong className="text-foreground">Spotter Tools Pro</strong> — by
        DGWayne (Dustin Garner)
      </p>

      <div className="prose-custom space-y-8 text-muted leading-relaxed">
        <p>
          This page explains how to delete your{" "}
          <strong className="text-foreground">Spotter Tools Pro account</strong>{" "}
          and its associated data. An account is optional — if you use the app
          in guest mode or only with a Spotter Network sign-in, you do not have
          a Spotter Tools Pro account to delete.
        </p>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Option 1 — In the app (fastest)
          </h2>
          <p>
            Open Spotter Tools Pro and go to{" "}
            <strong className="text-foreground">
              Settings &rarr; Spotter Tools Pro Account &rarr; Delete
            </strong>
            . Confirm when prompted. Your account and its data are deleted{" "}
            <strong className="text-foreground">
              immediately and permanently
            </strong>
            . This cannot be undone.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Option 2 — By request
          </h2>
          <p>
            If you can&apos;t access the app, email{" "}
            <a
              href="mailto:spottertoolspro@gmail.com?subject=Delete%20my%20Spotter%20Tools%20Pro%20account"
              className="text-brand-teal hover:underline"
            >
              spottertoolspro@gmail.com
            </a>{" "}
            <strong className="text-foreground">
              from the email address associated with your account
            </strong>{" "}
            and ask us to delete it. We&apos;ll remove your account and confirm
            by reply, typically within a few days.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            What gets deleted
          </h2>
          <p>Deleting your account permanently removes:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Your email address</li>
            <li>Your username</li>
            <li>Any special-avatar access granted to your account</li>
          </ul>
          <p className="mt-3">
            Account data is deleted immediately upon request — it is not
            retained after deletion.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            What is not affected
          </h2>
          <p>
            Your Spotter Tools Pro account is separate from Spotter Network and
            from on-device data:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Your <strong className="text-foreground">Spotter Network</strong>{" "}
              sign-in (application ID) is stored only on your device and is
              unaffected by deleting your Spotter Tools Pro account.
            </li>
            <li>
              On-device data (your Spotter Network credential, saved storm
              reports, and app settings) lives only on your phone and is removed
              when you uninstall the app.
            </li>
          </ul>
          <p className="mt-3">
            See our{" "}
            <a href="/privacy" className="text-brand-teal hover:underline">
              Privacy Policy
            </a>{" "}
            for full details on what data the app collects and how it is stored.
          </p>
        </section>

        <hr className="border-white/10" />

        <p className="text-center text-sm">
          &copy; 2026 DGWayne. All rights reserved.
        </p>
      </div>
    </main>
  );
}
