// src/pages/Terms.tsx
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and
            provision of this agreement. In addition, when using this website's services, you shall
            be subject to any posted guidelines or rules applicable to such services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">2. Use of Services</h2>
          <p>
            You agree to use the services only for lawful purposes and in a way that does not
            infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the
            services. Prohibited behavior includes harassing or causing distress or inconvenience
            to any other user, transmitting obscene or offensive content, or disrupting normal
            flow of dialogue within the services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">3. Account Security</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password
            and for restricting access to your computer. You agree to accept responsibility for all
            activities that occur under your account or password.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">4. Limitation of Liability</h2>
          <p>
            In no event shall the website owner or its affiliates be liable for any direct, indirect,
            incidental, special, or consequential damages resulting from the use or the inability to
            use the services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. It is your responsibility to
            review the terms regularly. Continued use of the services after changes constitute
            acceptance of the new terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">6. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws
            of the applicable jurisdiction, and you irrevocably submit to the exclusive
            jurisdiction of the courts in that State or location.
          </p>
        </section>

        <p className="mt-8 text-sm text-gray-300">
          Last updated: December 6, 2025
        </p>
      </div>
    </div>
  );
}
