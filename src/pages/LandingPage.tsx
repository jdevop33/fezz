import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Users, TrendingUp, ShieldCheck, Truck, BarChart3, 
  CheckCircle2, ArrowRight, ChevronDown, Sparkles, Dumbbell
} from 'lucide-react';
import Footer from '../components/Footer';
import { ThemeToggle } from '../components/ThemeToggle';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-900 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/80 dark:bg-surface-900/80 border-b border-surface-200 dark:border-surface-800">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <span className="ml-2 text-xl font-semibold text-surface-900 dark:text-white">WholesaleConnect</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <NavItem href="#features">Features</NavItem>
            <NavItem href="#stats">Stats</NavItem>
            <NavItem href="#testimonials">Testimonials</NavItem>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/signup"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
            alt="Warehouse operations"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 to-surface-950/70 dark:from-primary-950/90 dark:to-surface-950/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/50 px-3 py-1 text-sm font-medium text-primary-800 dark:text-primary-300 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-1.5" />
              New features released
            </span>
            <h1 className="text-display-3 sm:text-display-2 lg:text-display-1 font-extrabold tracking-tight text-white">
              Transform Your Distribution Network
            </h1>
            <p className="mt-6 text-xl text-primary-50 max-w-2xl">
              Connect with trusted wholesalers and retailers. Streamline your supply chain and grow your business with our powerful platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="btn-primary py-3 px-8 text-base shadow-soft-xl"
              >
                Join the Network
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center py-3 px-8 border border-white/30 bg-white/10 backdrop-blur-sm text-base font-medium rounded-md text-white hover:bg-white/20 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
        
        {/* Curved divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-surface-900">
          <svg className="absolute -top-16 w-full h-16 text-white dark:text-surface-900 fill-current" viewBox="0 0 1440 64" preserveAspectRatio="none">
            <path d="M0,0 C480,64 960,64 1440,0 L1440,64 L0,64 Z"></path>
          </svg>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white dark:bg-surface-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-success-100 dark:bg-success-900/30">
                  <CheckCircle2 className="h-6 w-6 text-success-600 dark:text-success-400" />
                </div>
                <span className="ml-3 text-lg font-medium text-surface-900 dark:text-white">Verified Network</span>
              </div>
              <p className="mt-2 text-surface-600 dark:text-surface-400">All partners undergo thorough verification before joining</p>
            </div>
            <div className="card p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30">
                  <ShieldCheck className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="ml-3 text-lg font-medium text-surface-900 dark:text-white">Secure Payments</span>
              </div>
              <p className="mt-2 text-surface-600 dark:text-surface-400">Bank-grade security for all transactions</p>
            </div>
            <div className="card p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary-100 dark:bg-secondary-900/30">
                  <Users className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <span className="ml-3 text-lg font-medium text-surface-900 dark:text-white">24/7 Support</span>
              </div>
              <p className="mt-2 text-surface-600 dark:text-surface-400">Dedicated team ready to assist you anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-24 bg-surface-50 dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-surface-900 dark:text-white">
              Everything you need to succeed
            </p>
            <p className="mt-4 max-w-2xl text-xl text-surface-500 dark:text-surface-400 lg:mx-auto">
              Our platform provides all the tools you need to build and manage your wholesale distribution network.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              <Feature
                icon={Users}
                iconBg="bg-blue-500"
                title="Dual Role System"
                description="Choose between Referrer and Distributor roles, or combine both for maximum earnings potential."
              />
              <Feature
                icon={TrendingUp}
                iconBg="bg-green-500"
                title="Commission Structure"
                description="Earn 5% as a Referrer or Distributor, or 10% when you take on both roles."
              />
              <Feature
                icon={ShieldCheck}
                iconBg="bg-indigo-500"
                title="Verified Network"
                description="All accounts are verified by admin approval, ensuring a trusted network of partners."
              />
              <Feature
                icon={Truck}
                iconBg="bg-amber-500"
                title="Inventory Tracking"
                description="Real-time inventory management and order tracking for efficient operations."
              />
              <Feature
                icon={BarChart3}
                iconBg="bg-rose-500"
                title="Live Analytics"
                description="Track your earnings, monitor performance, and optimize your business strategy."
              />
              <Feature
                icon={Dumbbell}
                iconBg="bg-violet-500"
                title="Business Growth"
                description="Access tools and resources designed to help scale your distribution network."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trusted by businesses worldwide
            </h2>
            <p className="mt-3 text-xl text-primary-100">
              Join thousands of businesses that use our platform to grow their wholesale operations.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard value="10,000+" label="Active Users" />
            <StatCard value="$50M+" label="Monthly Volume" />
            <StatCard value="99.9%" label="Uptime" />
            <StatCard value="24/7" label="Support" />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-24 bg-white dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-surface-900 dark:text-white sm:text-4xl">
              What our customers are saying
            </h2>
            <p className="mt-4 text-xl text-surface-500 dark:text-surface-400">
              Don't just take our word for it — hear from some of our amazing customers.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Testimonial
              quote="WholesaleConnect transformed our distribution process. We've seen a 40% increase in sales since joining the network."
              author="Sarah Johnson"
              role="CEO, Johnson Distributors"
              company="Johnson Distributors"
            />
            <Testimonial
              quote="The dual role system is genius. We're earning commissions as both referrers and distributors, maximizing our revenue streams."
              author="Michael Chen"
              role="Operations Director"
              company="Global Supply Co."
            />
            <Testimonial
              quote="The platform's verification process ensures we only work with legitimate partners. This level of trust is invaluable in our industry."
              author="Emma Rodriguez"
              role="Head of Partnerships"
              company="EuroTrade Ltd."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700 dark:bg-primary-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-200">Join our network today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-900 bg-white hover:bg-primary-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Request a demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white font-medium"
    >
      {children}
    </a>
  );
}

function Feature({ 
  icon: Icon, 
  title, 
  description,
  iconBg
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  iconBg: string;
}) {
  return (
    <div className="relative group">
      <dt>
        <div className={`absolute flex items-center justify-center h-12 w-12 rounded-xl ${iconBg} text-white shadow-md transition-all duration-200 group-hover:scale-110`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="ml-16 text-lg leading-6 font-medium text-surface-900 dark:text-white">{title}</p>
      </dt>
      <dd className="mt-2 ml-16 text-base text-surface-600 dark:text-surface-400">{description}</dd>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center backdrop-blur-md bg-white/10 rounded-xl p-8">
      <div className="text-5xl font-extrabold text-white">{value}</div>
      <div className="mt-2 text-lg font-medium text-primary-100">{label}</div>
    </div>
  );
}

function Testimonial({ quote, author, role, company }: { quote: string; author: string; role: string; company: string }) {
  return (
    <div className="card flex flex-col p-8 h-full">
      <div className="flex-1">
        <div className="flex h-10 w-10 mb-4">
          <svg className="h-full w-full text-primary-500 dark:text-primary-400" fill="currentColor" viewBox="0 0 32 32">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
        </div>
        <p className="text-lg text-surface-700 dark:text-surface-300">{quote}</p>
      </div>
      <div className="mt-8">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-800"></div>
          <div className="ml-3">
            <p className="text-sm font-medium text-surface-900 dark:text-white">{author}</p>
            <div className="text-sm text-surface-500 dark:text-surface-400">
              {role} • {company}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;