import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Spotter Tools Pro",
  description:
    "Privacy policy for Spotter Tools Pro, the professional storm spotting app for iOS and Android.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <h1 className="mb-2 text-4xl font-bold">Privacy Policy</h1>
      <p className="mb-10 text-sm text-muted">
        for <strong className="text-foreground">Spotter Tools Pro</strong>
      </p>

      <div className="prose-custom space-y-8 text-muted leading-relaxed">
        <p className="text-sm">
          <strong className="text-foreground">Last updated:</strong> July 2,
          2026
          <br />
          <strong className="text-foreground">Developer:</strong> DGWayne
          (Dustin Garner)
          <br />
          <strong className="text-foreground">Contact:</strong>{" "}
          <a
            href="mailto:spottertoolspro@gmail.com"
            className="text-brand-teal hover:underline"
          >
            spottertoolspro@gmail.com
          </a>
        </p>

        <hr className="border-white/10" />

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Overview
          </h2>
          <p>
            Spotter Tools Pro (&quot;the App&quot;) is a storm spotting tool
            designed for certified storm spotters. This privacy policy explains
            what data the App collects, how it is used, and your choices
            regarding that data.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Data We Collect
          </h2>

          <h3 className="mb-2 mt-6 text-lg font-semibold text-foreground">
            Location Data
          </h3>
          <p>
            The App collects your GPS location (latitude, longitude, altitude,
            speed, and heading) when you activate the beacon feature. Location
            data is collected in the foreground and background while the beacon
            is active.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">Purpose:</strong> Your
            location is transmitted to Spotter Network (spotternetwork.org) so
            that the National Weather Service and other spotters can see your
            position during severe weather events. This is the core function
            of the App.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">You control this:</strong> The
            beacon must be manually started. You can stop it at any time. When
            the beacon is off, no location data is collected or transmitted for
            beaconing. (Sharing your location with other Spotter Tools Pro
            users is a separate, optional feature — see &quot;Location Sharing
            with Other Users&quot; below.)
          </p>

          <h3 className="mb-2 mt-6 text-lg font-semibold text-foreground">
            Spotter Network Credentials
          </h3>
          <p>
            The App stores your Spotter Network application ID locally on your
            device using encrypted storage. This credential is used solely to
            authenticate your position uploads and storm reports with Spotter
            Network.
          </p>

          <h3 className="mb-2 mt-6 text-lg font-semibold text-foreground">
            Spotter Tools Pro Account (Optional)
          </h3>
          <p>
            The App offers an optional Spotter Tools Pro account, which is
            separate from Spotter Network. Creating one is entirely optional —
            the App&apos;s core features work without it, in guest mode or with
            a Spotter Network sign-in. If you choose to create an account, we
            collect and store:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              Your <strong className="text-foreground">email address</strong>,
              used to sign in and, if enabled, to send a confirmation email.
            </li>
            <li>
              A <strong className="text-foreground">password</strong>, stored
              only in hashed form by our authentication provider (Supabase). We
              never see or store your raw password.
            </li>
            <li>
              An optional <strong className="text-foreground">username</strong>{" "}
              you choose, your selected map avatar, and any special-avatar
              access granted to your account.
            </li>
            <li>
              If you sign in with{" "}
              <strong className="text-foreground">Google or Apple</strong>, that
              provider shares your <strong className="text-foreground">name</strong>{" "}
              and email address with us to create your account.
            </li>
          </ul>
          <p className="mt-3">
            <strong className="text-foreground">Purpose:</strong> to let you
            sign in across devices and unlock optional features such as special
            map avatars.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">Where it&apos;s stored:</strong>{" "}
            account data is held by Supabase, a third-party backend provider, on
            servers located in the United States. See the Third-Party Services
            table below.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">You control this:</strong>{" "}
            accounts are optional, and you can permanently delete your account
            and its data at any time from within the App (Settings &rarr;
            Spotter Tools Pro Account &rarr; Delete).
          </p>

          <h3 className="mb-2 mt-6 text-lg font-semibold text-foreground">
            Location Sharing with Other Users (Presence)
          </h3>
          <p>
            If you have a Spotter Tools Pro account, you can optionally turn on{" "}
            <strong className="text-foreground">
              &quot;Show me on the map&quot;
            </strong>{" "}
            in Settings. It is <strong className="text-foreground">off by
            default</strong>. While it is on and the app is open, we share the
            following with other Spotter Tools Pro users who have also turned it
            on, and display it on their map:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              your current location (latitude / longitude, and heading when
              you&apos;re moving),
            </li>
            <li>your chosen map avatar,</li>
            <li>your username, and</li>
            <li>your optional bio, if you set one.</li>
          </ul>
          <p className="mt-3">
            <strong className="text-foreground">Where it&apos;s stored:</strong>{" "}
            presence data is held by Cloudflare, a third-party infrastructure
            provider, on servers in the United States, and only briefly —
            entries older than about 10 minutes are removed, so no location
            history is retained.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">Purpose:</strong> to let Spotter
            Tools Pro users see one another on the map during severe weather.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">You control this:</strong>{" "}
            presence is opt-in and off by default, requires a Spotter Tools Pro
            account, and is separate from the Spotter Network beacon. Turning
            off &quot;Show me on the map&quot; removes you from other users&apos;
            maps immediately.
          </p>

          <h3 className="mb-2 mt-6 text-lg font-semibold text-foreground">
            Storm Reports
          </h3>
          <p>
            When you submit a storm report (tornado, hail, wind, etc.), the
            report details — including type, description, location, and time —
            are transmitted to Spotter Network. Reports are also stored locally
            on your device for your records. The App does not capture or attach
            photos.
          </p>

          <h3 className="mb-2 mt-6 text-lg font-semibold text-foreground">
            Device Information
          </h3>
          <p>
            The App accesses basic device manufacturer information solely to
            provide device-specific battery optimization instructions. This
            data is not transmitted or stored.
          </p>

          <h3 className="mb-2 mt-6 text-lg font-semibold text-foreground">
            Crash &amp; Diagnostic Data
          </h3>
          <p>
            To help us find and fix bugs, the App uses Sentry, a third-party
            error-reporting service, to collect anonymous crash reports and
            diagnostic data (such as the error, a stack trace, the app version,
            and basic device/OS type) when the App encounters a problem. This
            data is used solely to improve stability. It is not linked to your
            identity, is not used to track you, and is never sold.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Data We Do NOT Collect
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              We do <strong className="text-foreground">not</strong> collect
              your phone number.
            </li>
            <li>
              We do <strong className="text-foreground">not</strong> require an
              account to use the App&apos;s core features — guest mode or a
              Spotter Network sign-in is enough. An email address is collected
              only if you choose to create an optional Spotter Tools Pro account
              (described above).
            </li>
            <li>
              We do <strong className="text-foreground">not</strong> use
              analytics, tracking, or advertising SDKs.
            </li>
            <li>
              We do <strong className="text-foreground">not</strong> sell,
              share, or monetize any user data.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Third-Party Services
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="py-3 pr-4 font-semibold text-foreground">
                    Service
                  </th>
                  <th className="py-3 pr-4 font-semibold text-foreground">
                    Purpose
                  </th>
                  <th className="py-3 font-semibold text-foreground">
                    Privacy Policy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Spotter Network
                  </td>
                  <td className="py-3 pr-4">
                    Receives your GPS position and storm reports
                  </td>
                  <td className="py-3">
                    <a
                      href="https://www.spotternetwork.org"
                      className="text-brand-teal hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      spotternetwork.org
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    National Weather Service API
                  </td>
                  <td className="py-3 pr-4">
                    Provides active weather alerts and warnings
                  </td>
                  <td className="py-3">
                    <a
                      href="https://www.weather.gov/privacy"
                      className="text-brand-teal hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      weather.gov/privacy
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Storm Prediction Center
                  </td>
                  <td className="py-3 pr-4">
                    Provides today&apos;s public storm reports, mesoscale
                    discussions, and convective outlooks
                  </td>
                  <td className="py-3">
                    <a
                      href="https://www.noaa.gov/privacy-policy"
                      className="text-brand-teal hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      noaa.gov/privacy
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Mapbox
                  </td>
                  <td className="py-3 pr-4">
                    Provides map tiles, rendering, and location search
                  </td>
                  <td className="py-3">
                    <a
                      href="https://www.mapbox.com/legal/privacy"
                      className="text-brand-teal hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      mapbox.com/legal/privacy
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Sentry
                  </td>
                  <td className="py-3 pr-4">
                    Receives anonymous crash &amp; diagnostic reports to improve
                    stability
                  </td>
                  <td className="py-3">
                    <a
                      href="https://sentry.io/privacy/"
                      className="text-brand-teal hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      sentry.io/privacy
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Supabase
                  </td>
                  <td className="py-3 pr-4">
                    Hosts optional Spotter Tools Pro accounts (email, username,
                    map-avatar access)
                  </td>
                  <td className="py-3">
                    <a
                      href="https://supabase.com/privacy"
                      className="text-brand-teal hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      supabase.com/privacy
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Cloudflare
                  </td>
                  <td className="py-3 pr-4">
                    Hosts the opt-in presence service (briefly stores your
                    shared location, avatar, username, and bio)
                  </td>
                  <td className="py-3">
                    <a
                      href="https://www.cloudflare.com/privacypolicy/"
                      className="text-brand-teal hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      cloudflare.com/privacypolicy
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Data Storage
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-foreground">On-device.</strong> Your
              Spotter Network credentials are stored in encrypted device
              storage, and storm reports in a local SQLite database.
            </li>
            <li>
              <strong className="text-foreground">Account data.</strong> If you
              create an optional Spotter Tools Pro account, your account data
              (email, username, and map-avatar access) is stored by Supabase on
              servers in the United States, as described above.
            </li>
            <li>
              <strong className="text-foreground">Presence data.</strong> If you
              turn on &quot;Show me on the map,&quot; your shared location,
              avatar, username, and bio are held briefly by Cloudflare (United
              States) and removed after about 10 minutes — no location history
              is kept. Aside from Supabase (accounts) and Cloudflare
              (presence), all other network communication goes directly to the
              third-party public data services listed above.
            </li>
            <li>
              <strong className="text-foreground">Uninstalling.</strong>{" "}
              Locally stored data is permanently deleted when you uninstall the
              App. If you created a Spotter Tools Pro account, uninstalling does
              not delete your server-side account data — use the in-app account
              deletion described below.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Permissions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="py-3 pr-4 font-semibold text-foreground">
                    Permission
                  </th>
                  <th className="py-3 font-semibold text-foreground">
                    Why It&apos;s Needed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Location (Always)
                  </td>
                  <td className="py-3">
                    GPS beacon transmission to Spotter Network while the App
                    is in the background
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Notifications
                  </td>
                  <td className="py-3">
                    Displaying beacon status and severe weather alerts
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Full-Screen Intent (Android 14+)
                  </td>
                  <td className="py-3">
                    Android only. Optional alarm-style takeover for Tornado
                    Emergency and PDS warnings — only used for the most
                    life-threatening alerts
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Boot Completed
                  </td>
                  <td className="py-3">
                    Android only. Optional — restarts the beacon after a device
                    reboot if you have that setting enabled
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    Internet
                  </td>
                  <td className="py-3">
                    Communicating with Spotter Network, NWS, SPC, and Mapbox
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Account Deletion
          </h2>
          <p>
            If you create an optional Spotter Tools Pro account, you can
            permanently delete it — and all associated account data (email,
            username, and map-avatar access) — at any time from within the App:{" "}
            <strong className="text-foreground">
              Settings &rarr; Spotter Tools Pro Account &rarr; Delete
            </strong>
            . This action is immediate and irreversible. Your Spotter Network
            sign-in and any on-device data are separate and unaffected.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Children&apos;s Privacy
          </h2>
          <p>
            The App is not directed at children under 13 and does not knowingly
            collect data from children.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will
            be reflected by the &quot;Last updated&quot; date at the top of
            this document. Continued use of the App after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Contact
          </h2>
          <p>
            If you have questions about this Privacy Policy, contact:
          </p>
          <p className="mt-2">
            <strong className="text-foreground">Dustin Garner</strong>
            <br />
            <a
              href="mailto:spottertoolspro@gmail.com"
              className="text-brand-teal hover:underline"
            >
              spottertoolspro@gmail.com
            </a>
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
