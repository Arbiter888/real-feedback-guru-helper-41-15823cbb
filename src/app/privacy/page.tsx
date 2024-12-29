import React from "react";
import Link from "next/link";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Multiplier Ltd trading as EatUP!</h1>
          <div className="flex justify-between text-gray-600">
            <h2 className="font-medium">Privacy Policy</h2>
            <p>Last updated: {new Date().toLocaleDateString('en-GB', { 
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            At EatUP!, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">1. Information We Collect</h2>
          <div className="space-y-4">
            <p className="text-gray-700">We collect information that you provide directly to us when you:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Register for an account</li>
              <li>Make a purchase</li>
              <li>Sign up for our newsletter</li>
              <li>Contact us</li>
              <li>Participate in surveys or promotions</li>
            </ul>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700">
            We use the information we collect to provide, maintain, and improve our services, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700">
            <li>Process your transactions</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Respond to your comments and questions</li>
            <li>Protect against fraudulent or illegal activity</li>
          </ul>
        </section>

        {/* Data Sharing */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">3. Information Sharing</h2>
          <p className="text-gray-700">
            We do not sell or rent your personal information to third parties. We may share your information with:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700">
            <li>Service providers who assist in our operations</li>
            <li>Law enforcement when required by law</li>
            <li>Professional advisors such as lawyers and accountants</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">4. Your Rights</h2>
          <p className="text-gray-700">
            Under data protection laws, you have rights including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700">
            <li>The right to access your personal data</li>
            <li>The right to correct your personal data</li>
            <li>The right to request deletion of your personal data</li>
            <li>The right to restrict processing of your personal data</li>
            <li>The right to object to processing of your personal data</li>
          </ul>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="font-bold text-lg mb-4">5. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="mt-4 space-y-2 text-gray-700">
            <p>Email: george@multiplier.info</p>
            <p>Address: 71-75 Shelton Street, London, England, WC2H 9JQ</p>
          </div>
        </section>

        {/* Back to Home */}
        <div className="mt-12 border-t pt-8">
          <Link href="/" className="text-primary hover:text-primary-dark transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;