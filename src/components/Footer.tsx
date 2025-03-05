import React from 'react';
import { Building2, Shield, Award, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Secure Platform</h3>
              <p className="text-sm text-gray-500">Bank-level security protocols</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Award className="h-8 w-8 text-primary-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Verified Partners</h3>
              <p className="text-sm text-gray-500">Thoroughly vetted network</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Scale className="h-8 w-8 text-primary-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Fair Commission</h3>
              <p className="text-sm text-gray-500">Transparent earnings structure</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-primary-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Enterprise Ready</h3>
              <p className="text-sm text-gray-500">Built for scale and growth</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">WholesaleConnect</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Empowering businesses through a trusted wholesale distribution network.
              Connect, grow, and succeed together.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-base text-gray-500 hover:text-gray-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/blog" className="text-base text-gray-500 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-base text-gray-500 hover:text-gray-900">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-base text-gray-500 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="text-base text-gray-500 hover:text-gray-900">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 py-8">
          <p className="text-sm text-gray-500 text-center">
            © {currentYear} WholesaleConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;