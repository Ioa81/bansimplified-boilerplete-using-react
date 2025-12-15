// src/pages/Privacy.tsx
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">1. Information Collection</h2>
          <p>
            We collect personal information that you provide when using our services, such as
            name, email address, phone number, and address. We may also collect data on how you
            interact with our website and services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">2. Use of Information</h2>
          <p>
            The information collected is used to provide and improve our services, communicate
            with users, process orders, and ensure security and compliance with legal obligations.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">3. Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may
            share data with trusted partners to operate the website, conduct business, or comply
            with the law.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your data from unauthorized
            access, alteration, disclosure, or destruction. However, no method of transmission
            over the Internet is completely secure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">5. Updates to Privacy Policy</h2>
          <p>
            We may update this policy periodically. Changes will be posted on this page, and
            your continued use of our services constitutes acceptance of any updates.
          </p>
        </section>

        <p className="mt-8 text-sm text-gray-300">
          Last updated: December 6, 2025
        </p>
      </div>
    </div>
  );
}
