import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Mail } from 'lucide-react';

// FAQ item interface
interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: 'products' | 'orders' | 'shipping' | 'account';
}

const FAQPage: React.FC = () => {
  // State for managing which FAQ items are expanded
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Toggle FAQ item expansion
  const toggleItem = (index: number) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedItems(newExpandedItems);
  };

  // FAQ data
  const faqItems: FAQItem[] = [
    // Product questions
    {
      question: 'What are nicotine pouches?',
      answer: (
        <div>
          <p>
            Nicotine pouches are tobacco-free, pre-portioned pouches containing nicotine, flavorings, plant-based fibers, and food-grade fillers. They deliver nicotine satisfaction without the need for smoking or vaping.
          </p>
          <p className="mt-2">
            Users place a pouch between their upper lip and gum for up to 60 minutes to experience the nicotine effect and flavor.
          </p>
        </div>
      ),
      category: 'products',
    },
    {
      question: 'Are your products tobacco-free?',
      answer: (
        <p>
          Yes, all our products are 100% tobacco-free. They contain pharmaceutical-grade nicotine along with plant-based fibers, food-grade fillers, flavorings, and pH adjusters to ensure a clean, tobacco-free experience.
        </p>
      ),
      category: 'products',
    },
    {
      question: 'What nicotine strengths do you offer?',
      answer: (
        <p>
          We offer our products in multiple strength levels to suit different preferences:
          <ul className="list-disc pl-5 mt-2">
            <li><strong>6mg</strong> (Light) - Good for beginners or those who prefer a milder experience</li>
            <li><strong>12mg</strong> (Regular) - Medium strength for moderate users</li>
            <li><strong>16mg</strong> (Strong) - Higher strength for experienced users</li>
            <li><strong>22mg</strong> (Extra Strong) - Maximum strength for experienced users seeking intense nicotine satisfaction</li>
          </ul>
        </p>
      ),
      category: 'products',
    },
    {
      question: 'How should I store my nicotine pouches?',
      answer: (
        <p>
          For optimal freshness and flavor, store your pouches in a cool, dry place away from direct sunlight. The original container is designed to keep the pouches fresh. Always ensure the lid is tightly closed after use to prevent the pouches from drying out. Refrigeration is not necessary but can extend freshness in very hot climates.
        </p>
      ),
      category: 'products',
    },
    
    // Orders questions
    {
      question: 'How do I place an order?',
      answer: (
        <ol className="list-decimal pl-5">
          <li>Browse our products and select the items you wish to purchase</li>
          <li>Add products to your cart</li>
          <li>Proceed to checkout</li>
          <li>Create an account or login if you already have one</li>
          <li>Complete the age verification process</li>
          <li>Enter your shipping and payment information</li>
          <li>Review and place your order</li>
        </ol>
      ),
      category: 'orders',
    },
    {
      question: 'What payment methods do you accept?',
      answer: (
        <p>
          We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. For wholesale orders, we also offer terms for qualified businesses.
        </p>
      ),
      category: 'orders',
    },
    {
      question: 'Can I modify or cancel my order?',
      answer: (
        <p>
          You can modify or cancel your order within 2 hours of placement, provided it hasn't been processed for shipping. To make changes, please contact our customer service team immediately with your order number. After the 2-hour window, we cannot guarantee that modifications or cancellations can be processed.
        </p>
      ),
      category: 'orders',
    },
    {
      question: 'How do I track my order?',
      answer: (
        <p>
          Once your order ships, you'll receive a confirmation email with a tracking number and link. You can also view your order status and tracking information in your account dashboard under "Order History."
        </p>
      ),
      category: 'orders',
    },
    
    // Shipping questions
    {
      question: 'Where do you ship to?',
      answer: (
        <p>
          We currently ship to all 50 U.S. states. International shipping is not available at this time, but we're working on expanding our service to select countries in the future.
        </p>
      ),
      category: 'shipping',
    },
    {
      question: 'How much does shipping cost?',
      answer: (
        <div>
          <p>Our shipping rates are as follows:</p>
          <ul className="list-disc pl-5 mt-2">
            <li><strong>Standard Shipping (3-5 business days):</strong> $5.99, FREE on orders over $50</li>
            <li><strong>Express Shipping (1-2 business days):</strong> $12.99, available for all orders</li>
          </ul>
          <p className="mt-2">
            Shipping times are estimates and do not include order processing time, which is typically 1 business day.
          </p>
        </div>
      ),
      category: 'shipping',
    },
    {
      question: 'Do you offer expedited shipping?',
      answer: (
        <p>
          Yes, we offer express shipping (1-2 business days) for $12.99. This option is available for all orders and can be selected during checkout. Please note that orders placed after 2 PM EST will be processed the following business day.
        </p>
      ),
      category: 'shipping',
    },
    {
      question: 'What is your return policy?',
      answer: (
        <p>
          Due to the nature of our products, we cannot accept returns for opened items. If you receive damaged or incorrect products, please contact our customer service team within 48 hours of delivery with photos of the damaged items and packaging. We'll arrange for a replacement or refund. Unopened products in their original packaging may be returned within 14 days of delivery for a full refund minus shipping costs.
        </p>
      ),
      category: 'shipping',
    },
    
    // Account questions
    {
      question: 'How do I create an account?',
      answer: (
        <p>
          You can create an account by clicking the "Account" icon in the top right of our website and selecting "Create Account." You'll need to provide your email address, create a password, and verify that you are at least 21 years old. You can also create an account during the checkout process.
        </p>
      ),
      category: 'account',
    },
    {
      question: 'What is age verification and how does it work?',
      answer: (
        <p>
          To comply with legal requirements, we verify that all customers are at least 21 years old. During checkout, we use a third-party age verification service that checks your information against public records. This process is secure and typically takes only a few seconds. In some cases, we may require additional documentation, which you can upload securely through your account.
        </p>
      ),
      category: 'account',
    },
    {
      question: 'How do I update my account information?',
      answer: (
        <p>
          You can update your account information by logging into your account and navigating to the "Account Settings" section. Here, you can modify your personal information, change your password, update payment methods, and manage shipping addresses.
        </p>
      ),
      category: 'account',
    },
    {
      question: 'What is your privacy policy?',
      answer: (
        <p>
          We take your privacy seriously and are committed to protecting your personal information. Our full privacy policy details how we collect, use, and protect your data. In short, we only collect information necessary to process orders and improve our services, we never sell your data to third parties, and we use industry-standard security measures to protect your information. You can read our complete privacy policy <Link to="/privacy" className="text-primary-600 hover:text-primary-700 underline">here</Link>.
        </p>
      ),
      category: 'account',
    },
  ];

  // Filter FAQ items based on active category
  const filteredFAQs = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(faqItems.map(item => item.category)))];

  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* FAQ Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-xl text-surface-600">
            Find answers to common questions about our products, orders, shipping, and more.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-12">
          <div className="border-b border-surface-200">
            <nav className="-mb-px flex flex-wrap justify-center space-x-8" aria-label="FAQ Categories">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                    activeCategory === category
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-surface-500 hover:border-surface-300 hover:text-surface-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="divide-y divide-surface-200 rounded-xl border border-surface-200 bg-white">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="px-4 py-6 sm:px-6">
              <button
                onClick={() => toggleItem(index)}
                className="flex w-full items-start justify-between text-left"
                aria-expanded={expandedItems.has(index)}
              >
                <span className="text-lg font-medium text-surface-900">{faq.question}</span>
                <span className="ml-6 flex h-7 items-center">
                  {expandedItems.has(index) ? (
                    <Minus
                      className="h-6 w-6 text-primary-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <Plus
                      className="h-6 w-6 text-surface-400"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </button>
              <div
                className={`mt-2 pr-12 transition-all duration-300 ease-in-out ${
                  expandedItems.has(index) ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
                }`}
              >
                <div className="text-base text-surface-600">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Not finding answer section */}
        <div className="mt-16 text-center">
          <h2 className="text-xl font-bold text-surface-900">
            Can't find the answer you're looking for?
          </h2>
          <p className="mt-2 text-surface-600">
            Our customer support team is here to help.
          </p>
          <div className="mt-6">
            <Link
              to="/contact"
              className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;