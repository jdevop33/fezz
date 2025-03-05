import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, TrendingUp, ShieldCheck, Truck, BarChart3, CheckCircle2 } from 'lucide-react';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">WholesaleConnect</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/signup"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Transform Your Distribution Network
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Connect with trusted wholesalers and retailers. Streamline your supply chain and grow your business with our powerful platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Join the Network
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span className="ml-2 text-lg font-medium">Verified Network</span>
              </div>
              <p className="mt-2 text-gray-600">All partners undergo thorough verification</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span className="ml-2 text-lg font-medium">Secure Payments</span>
              </div>
              <p className="mt-2 text-gray-600">Bank-grade security for all transactions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span className="ml-2 text-lg font-medium">24/7 Support</span>
              </div>
              <p className="mt-2 text-gray-600">Dedicated team ready to assist you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <Feature
                icon={Users}
                title="Dual Role System"
                description="Choose between Referrer and Distributor roles, or combine both for maximum earnings potential."
              />
              <Feature
                icon={TrendingUp}
                title="Commission Structure"
                description="Earn 5% as a Referrer or Distributor, or 10% when you take on both roles."
              />
              <Feature
                icon={ShieldCheck}
                title="Verified Network"
                description="All accounts are verified by admin approval, ensuring a trusted network of partners."
              />
              <Feature
                icon={Truck}
                title="Inventory Tracking"
                description="Real-time inventory management and order tracking for efficient operations."
              />
              <Feature
                icon={BarChart3}
                title="Live Analytics"
                description="Track your earnings, monitor performance, and optimize your business strategy."
              />
              <Feature
                icon={Building2}
                title="Business Growth"
                description="Access tools and resources designed to help scale your distribution network."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-white">10,000+</div>
              <div className="mt-2 text-lg font-medium text-primary-100">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-white">$50M+</div>
              <div className="mt-2 text-lg font-medium text-primary-100">Monthly Volume</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-white">99.9%</div>
              <div className="mt-2 text-lg font-medium text-primary-100">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-white">24/7</div>
              <div className="mt-2 text-lg font-medium text-primary-100">Support</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Feature({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="relative">
      <dt>
        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{title}</p>
      </dt>
      <dd className="mt-2 ml-16 text-base text-gray-500">{description}</dd>
    </div>
  );
}

export default LandingPage;