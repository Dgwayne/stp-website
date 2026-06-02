import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Spotter Tools Pro",
  description:
    "Terms of Service, license, and severe-weather disclaimer for Spotter Tools Pro, the professional storm spotting app for iOS and Android.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <h1 className="mb-2 text-4xl font-bold">Terms of Service</h1>
      <p className="mb-10 text-sm text-muted">
        for <strong className="text-foreground">Spotter Tools Pro</strong>
      </p>

      <div className="prose-custom space-y-8 text-muted leading-relaxed">
        <p className="text-sm">
          <strong className="text-foreground">Last updated:</strong> June 2,
          2026
          <br />
          <strong className="text-foreground">Effective date:</strong> June 2,
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

        <div
          role="alert"
          className="rounded-lg border border-brand-orange/40 bg-brand-orange/10 p-5"
        >
          <p className="mb-2 font-semibold uppercase tracking-wide text-brand-orange">
            Severe Weather Disclaimer
          </p>
          <p className="text-sm text-foreground">
            Spotter Tools Pro is an informational tool intended for trained
            storm spotters and weather enthusiasts. It is{" "}
            <strong>NOT a substitute</strong> for official National Weather
            Service warnings, NOAA Weather Radio, or local emergency
            management guidance. Radar imagery, alerts, and notifications may
            be delayed, incomplete, or fail to deliver due to network,
            device, or third-party data conditions.{" "}
            <strong>
              Always rely on official sources for life-safety decisions. Use
              at your own risk.
            </strong>
          </p>
        </div>

        <hr className="border-white/10" />

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p>
            By downloading, installing, accessing, or using Spotter Tools Pro
            (&quot;the App&quot;), you agree to be bound by these Terms of
            Service (&quot;Terms&quot;) and our{" "}
            <a href="/privacy" className="text-brand-teal hover:underline">
              Privacy Policy
            </a>
            . If you do not agree to these Terms, do not install or use the
            App.
          </p>
          <p className="mt-3">
            These Terms form a binding agreement between you and DGWayne
            (Dustin Garner), the developer of the App
            (&quot;Developer,&quot; &quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;).
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            2. License Grant
          </h2>
          <p>
            Subject to your compliance with these Terms, the Developer grants
            you a limited, personal, non-exclusive, non-transferable,
            non-sublicensable, revocable license to install and use one copy
            of the App on iOS or Android devices that you own or control,
            solely for your personal, non-commercial storm spotting and severe
            weather monitoring purposes.
          </p>
          <p className="mt-3">
            This license is granted to you; it is not a sale of the App. All
            intellectual property rights in the App remain with the
            Developer.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            3. Permitted Use
          </h2>
          <p>The App is intended for:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Trained SKYWARN&reg; storm spotters and Spotter Network members
            </li>
            <li>Storm chasers and weather enthusiasts</li>
            <li>
              Personal situational awareness during severe weather events
            </li>
          </ul>
          <p className="mt-4">You agree NOT to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Use the App as a primary or sole source of life-safety weather
              information
            </li>
            <li>
              Reverse engineer, decompile, disassemble, or attempt to extract
              the source code of the App
            </li>
            <li>
              Resell, redistribute, sublicense, or commercially exploit the
              App or its contents
            </li>
            <li>
              Use the App in a manner that violates Spotter Network&apos;s
              terms of service or NWS API usage guidelines
            </li>
            <li>
              Submit false, misleading, or fraudulent storm reports through
              the App
            </li>
            <li>
              Use the App to harass, endanger, or impersonate other spotters
              or emergency personnel
            </li>
            <li>
              Use the App in any way that violates applicable local, state,
              federal, or international law
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            4. No User Accounts
          </h2>
          <p>
            The App does not require account creation. The only credential
            stored is your Spotter Network application ID, which you provide
            voluntarily for beacon and reporting features. We do not operate
            any servers, and we do not maintain user records. See the{" "}
            <a href="/privacy" className="text-brand-teal hover:underline">
              Privacy Policy
            </a>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            5. Third-Party Services and Data
          </h2>
          <p>
            The App displays data from and communicates with third-party
            services, including but not limited to:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-foreground">
                National Weather Service (NWS)
              </strong>{" "}
              — alerts, warnings, watches
            </li>
            <li>
              <strong className="text-foreground">
                Storm Prediction Center (SPC)
              </strong>{" "}
              — outlooks, mesoscale discussions, storm reports
            </li>
            <li>
              <strong className="text-foreground">NEXRAD Level 2</strong>{" "}
              data — operated by NOAA
            </li>
            <li>
              <strong className="text-foreground">Spotter Network</strong> —
              beacon transmission and report submission
            </li>
            <li>
              <strong className="text-foreground">Mapbox</strong> — map tile
              rendering and location search
            </li>
          </ul>
          <p className="mt-3">
            These services are operated by independent third parties. The
            Developer has no control over the accuracy, availability,
            timeliness, or completeness of data provided by these services
            and is not responsible for outages, errors, or omissions in their
            data. Your use of features that rely on third-party services may
            be subject to those services&apos; own terms and privacy
            policies.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            6. Not Affiliated With Government or Public-Safety Agencies
          </h2>
          <p>
            Spotter Tools Pro is an independent product. It is{" "}
            <strong className="text-foreground">
              not affiliated with, endorsed by, or sponsored by
            </strong>{" "}
            the National Oceanic and Atmospheric Administration (NOAA), the
            National Weather Service (NWS), the Storm Prediction Center
            (SPC), SKYWARN&reg;, Spotter Network, or any government agency.
          </p>
          <p className="mt-3">
            SKYWARN&reg; is a registered service mark of the National Oceanic
            and Atmospheric Administration and is used here only to
            describe the App&apos;s intended audience under nominative fair
            use.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            7. Disclaimer of Warranties
          </h2>
          <p className="rounded-md border border-white/10 bg-surface p-4 text-sm uppercase tracking-wide text-foreground">
            THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS
            AVAILABLE,&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE
            DEVELOPER DISCLAIMS ALL WARRANTIES, INCLUDING WITHOUT LIMITATION
            THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className="mt-3">
            Without limiting the foregoing, the Developer does not warrant
            that:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>The App will be uninterrupted, error-free, or secure</li>
            <li>
              Weather data, radar imagery, alerts, or notifications will be
              accurate, complete, timely, or delivered at all
            </li>
            <li>
              Defects in the App will be corrected within any particular
              timeframe, if at all
            </li>
            <li>
              The App will be compatible with all iOS or Android devices, OS
              versions, or carrier configurations
            </li>
          </ul>
          <p className="mt-3">
            Weather data, NEXRAD imagery, NWS alerts, and notifications may
            be delayed, inaccurate, incomplete, or fail to deliver due to
            network conditions, device state, battery optimization, OS
            restrictions, third-party service outages, or other factors
            outside the Developer&apos;s control.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            8. Limitation of Liability
          </h2>
          <p className="rounded-md border border-white/10 bg-surface p-4 text-sm uppercase tracking-wide text-foreground">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
            SHALL THE DEVELOPER BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES,
            INCLUDING BUT NOT LIMITED TO PERSONAL INJURY, DEATH, PROPERTY
            DAMAGE, LOSS OF DATA, LOSS OF PROFITS, OR BUSINESS INTERRUPTION,
            ARISING OUT OF OR RELATED TO YOUR USE OF, OR INABILITY TO USE,
            THE APP, EVEN IF THE DEVELOPER HAS BEEN ADVISED OF THE
            POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p className="mt-3 rounded-md border border-white/10 bg-surface p-4 text-sm uppercase tracking-wide text-foreground">
            THE DEVELOPER&apos;S TOTAL CUMULATIVE LIABILITY TO YOU FOR ALL
            CLAIMS ARISING OUT OF OR RELATED TO THE APP, WHETHER IN
            CONTRACT, TORT, OR OTHERWISE, SHALL NOT EXCEED THE AMOUNT YOU
            ACTUALLY PAID FOR THE APP IN THE TWELVE (12) MONTHS PRECEDING
            THE EVENT GIVING RISE TO LIABILITY, OR FIVE U.S. DOLLARS ($5.00),
            WHICHEVER IS GREATER.
          </p>
          <p className="mt-3">
            Some jurisdictions do not allow the exclusion or limitation of
            certain damages, so portions of this section may not apply to
            you. In such cases, the Developer&apos;s liability is limited to
            the smallest extent permitted by applicable law.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            9. Indemnification
          </h2>
          <p>
            You agree to defend, indemnify, and hold harmless the Developer
            from and against any claims, liabilities, damages, losses, and
            expenses (including reasonable legal fees) arising out of or in
            any way connected with: (a) your use or misuse of the App; (b)
            your violation of these Terms; (c) your violation of any
            third-party right; or (d) any storm report or content you submit
            through the App.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            10. Refunds and Purchases
          </h2>
          <p>
            Spotter Tools Pro is sold as a one-time purchase through the Apple
            App Store (iOS) and the Google Play Store (Android). Refunds are
            governed by the policies of the store you purchased from —{" "}
            <a
              href="https://support.apple.com/en-us/HT204084"
              className="text-brand-teal hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple&apos;s refund policy
            </a>{" "}
            or{" "}
            <a
              href="https://support.google.com/googleplay/answer/2479637"
              className="text-brand-teal hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Play&apos;s refund policy
            </a>{" "}
            — and are processed by Apple or Google, not the Developer. The
            Developer cannot issue refunds directly.
          </p>
          <p className="mt-3">
            We do not offer subscriptions, in-app purchases, recurring
            billing, or microtransactions of any kind.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            11. Intellectual Property
          </h2>
          <p>
            The App, including all text, graphics, code, icons, color
            palettes, layouts, and other content (excluding third-party data
            and trademarks), is the property of the Developer and is
            protected by copyright, trademark, and other intellectual
            property laws.
          </p>
          <p className="mt-3">
            Third-party names and marks (including NOAA, NWS, SPC,
            SKYWARN&reg;, Spotter Network, and Mapbox) belong to their
            respective owners. Their appearance in the App or on this site
            does not imply endorsement or affiliation.
          </p>
          <p className="mt-3">
            User-imported content (such as your own .pal color tables)
            remains your property. By importing content into the App, you
            represent that you have the right to do so.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            12. Termination
          </h2>
          <p>
            These Terms remain in effect until terminated. You may terminate
            them at any time by uninstalling the App. The Developer may
            terminate or suspend your license at any time, with or without
            notice, if you violate these Terms. Sections that by their
            nature should survive termination (including disclaimers,
            limitation of liability, indemnification, and intellectual
            property) will survive.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            13. Changes to These Terms
          </h2>
          <p>
            The Developer may revise these Terms from time to time. Material
            changes will be reflected by an updated &quot;Last updated&quot;
            date at the top of this page. Continued use of the App after
            changes constitutes acceptance of the revised Terms. If you do
            not agree to the revised Terms, you must stop using and
            uninstall the App.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            14. Governing Law and Dispute Resolution
          </h2>
          <p>
            These Terms are governed by the laws of the State of New
            Mexico, United States of America, without regard to its
            conflict-of-law principles. Any dispute arising out of or
            relating to these Terms or the App shall be resolved
            exclusively in the state or federal courts located in New
            Mexico, and you consent to the personal jurisdiction of those
            courts.
          </p>
          <p className="mt-3">
            You agree that any claim must be brought in your individual
            capacity and not as a plaintiff or class member in any class or
            representative proceeding.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            15. Severability
          </h2>
          <p>
            If any provision of these Terms is held to be invalid or
            unenforceable, that provision will be enforced to the maximum
            extent permissible, and the remaining provisions will continue
            in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            16. Entire Agreement
          </h2>
          <p>
            These Terms, together with the{" "}
            <a href="/privacy" className="text-brand-teal hover:underline">
              Privacy Policy
            </a>
            , constitute the entire agreement between you and the Developer
            regarding the App and supersede any prior agreements.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            17. Contact
          </h2>
          <p>If you have questions about these Terms, contact:</p>
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
