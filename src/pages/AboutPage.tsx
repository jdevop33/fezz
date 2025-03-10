import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Check, Users, LifeBuoy, BookOpen } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 py-16 sm:py-24">
        <div className="absolute inset-0">
          <div className="h-full w-full object-cover opacity-20">
            {/* Background pattern */}
            <svg
              className="absolute inset-0 h-full w-full"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="dots"
                  width="30"
                  height="30"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <circle cx="2" cy="2" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-center sm:mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              About POUCHES World
            </h1>
            <p className="mt-6 text-lg text-white text-opacity-80">
              We're on a mission to provide the highest quality nicotine pouches with exceptional flavors and a commitment to customer satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* Our story section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">
                Our Story
              </h2>
              <div className="mt-6 space-y-6 text-surface-600">
                <p>
                  Founded in 2020, POUCHES World began with a simple idea: create premium nicotine pouches that deliver both satisfaction and flavor without the drawbacks of traditional tobacco products.
                </p>
                <p>
                  Our journey started when our founders, experienced in the consumer products industry, recognized the growing demand for tobacco-free alternatives that don't compromise on quality or experience.
                </p>
                <p>
                  After extensive research and development, collaborating with flavor experts and quality control specialists, we launched our first line of pouches to overwhelmingly positive feedback.
                </p>
                <p>
                  Today, we've grown into a trusted brand with a loyal customer base across the country, continuously expanding our product line while maintaining our commitment to excellence.
                </p>
              </div>
            </div>
            <div className="mt-12 lg:col-span-1 lg:mt-0">
              <div className="aspect-w-5 aspect-h-4 overflow-hidden rounded-lg">
                <img
                  src="/images/products/banner.jpg"
                  alt="POUCHES World team"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-surface-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl lg:mx-auto lg:text-center">
            <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">
              Our Values
            </h2>
            <p className="mt-4 text-surface-600">
              These core principles guide everything we do, from product development to customer service.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Quality */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <Award size={24} />
              </div>
              <h3 className="mt-6 text-lg font-medium text-surface-900">Premium Quality</h3>
              <p className="mt-2 text-surface-600">
                We use only the highest-grade ingredients and maintain strict quality control throughout our manufacturing process.
              </p>
            </div>
            
            {/* Innovation */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <BookOpen size={24} />
              </div>
              <h3 className="mt-6 text-lg font-medium text-surface-900">Constant Innovation</h3>
              <p className="mt-2 text-surface-600">
                We're continuously researching and developing new flavors and formulations to deliver the best possible experience.
              </p>
            </div>
            
            {/* Customer Focus */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <Users size={24} />
              </div>
              <h3 className="mt-6 text-lg font-medium text-surface-900">Customer Focus</h3>
              <p className="mt-2 text-surface-600">
                Your satisfaction is our priority. We listen to feedback and are committed to providing exceptional service.
              </p>
            </div>
            
            {/* Transparency */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <Shield size={24} />
              </div>
              <h3 className="mt-6 text-lg font-medium text-surface-900">Transparency</h3>
              <p className="mt-2 text-surface-600">
                We're open about our ingredients and processes, ensuring you know exactly what you're getting with every purchase.
              </p>
            </div>
            
            {/* Responsibility */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <Check size={24} />
              </div>
              <h3 className="mt-6 text-lg font-medium text-surface-900">Responsibility</h3>
              <p className="mt-2 text-surface-600">
                We're committed to responsible marketing and strict age verification to ensure our products are only sold to adults.
              </p>
            </div>
            
            {/* Support */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <LifeBuoy size={24} />
              </div>
              <h3 className="mt-6 text-lg font-medium text-surface-900">Support</h3>
              <p className="mt-2 text-surface-600">
                Our customer service team is always ready to help with questions, concerns, or feedback about our products.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">
                About Our Products
              </h2>
              <div className="mt-6 space-y-6 text-surface-600">
                <p>
                  Our nicotine pouches are designed with your satisfaction and convenience in mind. Each pouch delivers a consistent nicotine experience with exceptional flavor that lasts.
                </p>
                <p>
                  We offer a range of nicotine strengths and flavors to suit different preferences, from refreshing mint varieties to fruity options like cherry and watermelon.
                </p>
                <p>
                  All our products are tobacco-free, containing pharmaceutical-grade nicotine and food-grade ingredients for a clean experience with no staining or mess.
                </p>
                <div className="mt-8">
                  <Link
                    to="/products"
                    className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Browse Our Products
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:col-span-7 lg:mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <img
                    src="/images/products/apple-mint-6mg.jpg"
                    alt="Apple Mint Pouches"
                    className="aspect-square rounded-lg object-cover"
                  />
                </div>
                <div className="col-span-1">
                  <img
                    src="/images/products/spearmint-16mg.jpg"
                    alt="Spearmint Pouches"
                    className="aspect-square rounded-lg object-cover"
                  />
                </div>
                <div className="col-span-2">
                  <img
                    src="/images/products/banner.jpg"
                    alt="Product Collection"
                    className="aspect-video rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-700">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            <span className="block">Ready to try our products?</span>
            <span className="block text-primary-100">Start your journey with POUCHES World today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-primary-600 hover:bg-primary-50"
              >
                Shop Now
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white hover:bg-primary-500"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;