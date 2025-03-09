import React from 'react';
import { Building2, Shield, Award, Scale, Mail, MapPin, Phone, Github, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import PaymentIcons from './PaymentIcons';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-white">Secure Platform</h3>
              <p className="text-sm text-surface-600 dark:text-surface-400">Bank-level security protocols</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-800/50 transition-colors">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-white">Verified Partners</h3>
              <p className="text-sm text-surface-600 dark:text-surface-400">Thoroughly vetted network</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 group-hover:bg-accent-200 dark:group-hover:bg-accent-800/50 transition-colors">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-white">Fair Commission</h3>
              <p className="text-sm text-surface-600 dark:text-surface-400">Transparent earnings structure</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 group-hover:bg-success-200 dark:group-hover:bg-success-800/50 transition-colors">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-white">Enterprise Ready</h3>
              <p className="text-sm text-surface-600 dark:text-surface-400">Built for scale and growth</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="ml-2 text-xl font-semibold text-surface-900 dark:text-white">WholesaleConnect</span>
            </div>
            <p className="mt-4 text-sm text-surface-600 dark:text-surface-400 max-w-md">
              Empowering businesses through a trusted wholesale distribution network.
              Connect, grow, and succeed together.
            </p>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Contact Us</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-surface-600 dark:text-surface-400">
                  <MapPin className="h-4 w-4 mr-2 text-surface-400 dark:text-surface-500" />
                  <span>123 Commerce St, New York, NY 10001</span>
                </div>
                <div className="flex items-center text-sm text-surface-600 dark:text-surface-400">
                  <Mail className="h-4 w-4 mr-2 text-surface-400 dark:text-surface-500" />
                  <span>contact@wholesaleconnect.com</span>
                </div>
                <div className="flex items-center text-sm text-surface-600 dark:text-surface-400">
                  <Phone className="h-4 w-4 mr-2 text-surface-400 dark:text-surface-500" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-4">
              <SocialLink icon={Twitter} href="https://twitter.com/wholesaleconnect" />
              <SocialLink icon={Linkedin} href="https://linkedin.com/company/wholesaleconnect" />
              <SocialLink icon={Facebook} href="https://facebook.com/wholesaleconnect" />
              <SocialLink icon={Github} href="https://github.com/wholesaleconnect" />
              <ThemeToggle />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/partners">Partners</FooterLink>
              <FooterLink to="/press">Press</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/guides">Guides</FooterLink>
              <FooterLink to="/help">Help Center</FooterLink>
              <FooterLink to="/webinars">Webinars</FooterLink>
              <FooterLink to="/documentation">Documentation</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/compliance">Compliance</FooterLink>
              <FooterLink to="/security">Security</FooterLink>
              <FooterLink to="/gdpr">GDPR</FooterLink>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-surface-200 dark:border-surface-800">
          <div className="max-w-xl mx-auto">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white tracking-wider uppercase text-center mb-4">
              Subscribe to our newsletter
            </h3>
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input w-full"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="py-8 border-t border-surface-200 dark:border-surface-800">
          <div className="max-w-xl mx-auto">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white tracking-wider uppercase text-center mb-2">
              Accepted Payment Methods
            </h3>
            <div className="flex justify-center">
              {/* Import our payment icons component */}
              <React.Suspense fallback={<div>Loading...</div>}>
                <PaymentIcons />
              </React.Suspense>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-surface-200 dark:border-surface-800 py-8">
          <p className="text-sm text-surface-500 dark:text-surface-400 text-center">
            © {currentYear} WholesaleConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-base text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ icon: Icon, href }: { icon: React.ElementType; href: string }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="h-10 w-10 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-500 dark:text-surface-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
    >
      <Icon className="h-5 w-5" />
      <span className="sr-only">Visit our social media</span>
    </a>
  );
}

export default Footer;