import { Mail } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  const handleEmailClick = () => {
    window.location.href = "mailto:george@multiplier.info?subject=Interest%20in%20EatUP!&body=Hi%2C%0A%0AI'm%20interested%20in%20learning%20more%20about%20EatUP!%0A%0ABest%20regards";
  };

  return (
    <footer className="bg-gray-50 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={handleEmailClick}
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </button>
            <Link
              href="/terms"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Terms & Conditions
            </Link>
            <a
              href="https://app.termly.io/policy-viewer/policy.html?policyUUID=d38fd480-a81a-4a8d-b881-6074818604f0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
          </div>
          <p className="text-sm text-gray-500 text-center px-4">
            © {new Date().getFullYear()} Multiplier Ltd trading as EatUP!. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};