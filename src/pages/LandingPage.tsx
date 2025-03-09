import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, Star, Flask, Shield
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
            <svg className="h-8 w-8 text-puxx-premium-600 dark:text-puxx-premium-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
            </svg>
            <span className="ml-2 text-xl font-semibold text-surface-900 dark:text-white">PUXX</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <NavItem href="#shop">Shop</NavItem>
            <NavItem href="#craftsmanship">Craftsmanship</NavItem>
            <NavItem href="#experience">Experience</NavItem>
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
      <section className="relative overflow-hidden bg-gradient-to-br from-surface-950 via-surface-900 to-primary-950 min-h-[90vh]">
        {/* Premium animated background particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute h-40 w-40 rounded-full bg-primary-600/30 blur-3xl animate-pulse-premium left-1/4 top-1/3"></div>
          <div className="absolute h-60 w-60 rounded-full bg-primary-400/20 blur-3xl animate-pulse-premium animation-delay-1000 right-1/4 top-1/2"></div>
          <div className="absolute h-32 w-32 rounded-full bg-puxx-premium-500/30 blur-3xl animate-pulse-premium animation-delay-2000 left-1/3 bottom-1/4"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content column */}
            <div className="space-y-8 animate-premium-fade-in">
              <div className="space-y-2">
                <span className="inline-flex items-center rounded-full bg-puxx-premium-900/20 px-3 py-1 text-sm font-medium text-puxx-premium-300 backdrop-blur-sm">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-puxx-premium-400 animate-pulse"></span>
                  A New Chapter in Satisfaction
                </span>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                  Elevate Your <span className="text-puxx-premium-500">Experience</span>
                </h1>
                <p className="text-xl sm:text-2xl text-surface-200 font-light mt-4 max-w-xl">
                  Precision Crafted for Those Who Demand More
                </p>
              </div>
              
              <p className="text-surface-300 text-lg max-w-xl leading-relaxed">
                In a world of compromises, PUXX stands apart. We've meticulously crafted 
                these premium nicotine pouches from the highest-grade sources available, 
                delivering an unparalleled experience without smoke or odor.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md 
                  bg-puxx-premium-700 text-white font-premium font-medium tracking-wide
                  shadow-md transition-all hover:bg-puxx-premium-900 hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-puxx-premium-500 focus:ring-offset-2 group"
                >
                  Begin Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md 
                  bg-transparent text-white font-premium font-medium tracking-wide
                  border border-surface-700 transition-all hover:bg-surface-800/50
                  focus:outline-none focus:ring-2 focus:ring-surface-500 focus:ring-offset-2"
                >
                  Discover Our Craft
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-surface-800">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-full bg-surface-800/50 p-2">
                    <Shield className="h-5 w-5 text-puxx-premium-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Uncompromising Quality</p>
                    <p className="text-xs text-surface-400">Globally-sourced excellence in every pouch</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-full bg-surface-800/50 p-2">
                    <Star className="h-5 w-5 text-puxx-premium-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Perfect Balance</p>
                    <p className="text-xs text-surface-400">Ideal harmony of flavor, strength, and comfort</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-full bg-surface-800/50 p-2">
                    <Flask className="h-5 w-5 text-puxx-premium-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Innovative Design</p>
                    <p className="text-xs text-surface-400">Optimal placement, minimal movement, maximum comfort</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product image column */}
            <div className="relative animate-fade-up animation-delay-300">
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-surface-900 to-surface-800 shadow-2xl aspect-square max-w-lg mx-auto">
                {/* Premium product image */}
                <img 
                  src="/images/products/card.jpeg" 
                  alt="PUXX Premium Nicotine Pouches" 
                  className="object-contain w-full h-full p-8"
                />
              </div>
              
              {/* Floating product tin */}
              <div className="absolute -bottom-6 right-6 w-56 rounded-xl overflow-hidden shadow-xl animate-bounce-subtle animation-delay-700">
                <div className="bg-surface-900/90 backdrop-blur p-3 text-center">
                  <h3 className="text-sm font-bold text-puxx-premium-400">Spearmint Sensation</h3>
                  <p className="text-xs text-surface-300 mt-1">Experience our signature blend of crisp spearmint with subtle notes of fresh-picked herbs.</p>
                </div>
              </div>
              
              {/* Strength indicator */}
              <div className="absolute top-6 left-6 backdrop-blur-md bg-surface-900/80 rounded-lg p-3">
                <div className="flex flex-col items-center">
                  <div className="text-xs uppercase text-surface-400 font-medium">Strength Profile</div>
                  <div className="mt-1 w-24 h-1.5 rounded-full bg-surface-700 overflow-hidden">
                    <div className="w-3/4 h-full bg-orange-500"></div>
                  </div>
                  <div className="mt-1 text-lg font-bold text-white">16mg</div>
                  <p className="text-xs text-surface-400 mt-1 max-w-[120px] text-center">Bold satisfaction for experienced users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elegant "About Our Craft" teaser */}
        <div className="bg-surface-950/90 backdrop-blur-sm py-12 relative z-10">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <span className="text-puxx-premium-500 text-xl font-bold">Smoke-Free</span>
                <p className="mt-2 text-surface-300 text-sm">A cleaner alternative delivering nicotine without the smoke, leaving no trace behind.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <span className="text-puxx-premium-500 text-xl font-bold">Discreet Elegance</span>
                <p className="mt-2 text-surface-300 text-sm">Enjoy your moments confidently with our odorless pouches, perfect for any setting.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <span className="text-puxx-premium-500 text-xl font-bold">Effortless Satisfaction</span>
                <p className="mt-2 text-surface-300 text-sm">No lighting, no charging, no maintenance—ready when you are, wherever life takes you.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Age verification notice */}
        <div className="absolute bottom-0 left-0 right-0 bg-surface-950/80 backdrop-blur-sm py-2 text-center text-xs text-surface-400">
          These products contain nicotine. Nicotine is an addictive chemical. For adult use only.
        </div>
      </section>

      {/* Product Showcase */}
      <section id="shop" className="bg-surface-50 dark:bg-surface-900 py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-medium text-primary-800 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 rounded-full mb-3">
              Crafted Perfection
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 dark:text-white">
              A Symphony of Sensations
            </h2>
            <p className="mt-4 text-lg text-surface-600 dark:text-surface-400 max-w-3xl mx-auto">
              Each PUXX collection represents our relentless pursuit of perfection, 
              offering distinct experiences for every preference and moment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Classic Collection Card */}
            <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-100 dark:border-surface-700 shadow-soft-xl overflow-hidden group">
              <div className="relative overflow-hidden">
                <img 
                  src="/images/products/spearmint-16mg.jpg" 
                  alt="PUXX Classic Collection" 
                  className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950 to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">PUXX Classic</h3>
                  <p className="text-surface-200 text-sm mt-1">Our signature line with balanced nicotine delivery</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-surface-700 dark:text-surface-300">
                  The foundation of our craft. PUXX Classic delivers a refined experience 
                  with meticulously balanced flavor profiles and consistent nicotine release.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-surface-900 dark:text-white">Spearmint</span>
                    <span className="text-xs font-medium text-surface-500 px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800">6mg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-surface-900 dark:text-white">Apple Mint</span>
                    <span className="text-xs font-medium text-surface-500 px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800">6mg • 12mg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-surface-900 dark:text-white">Cola</span>
                    <span className="text-xs font-medium text-surface-500 px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800">6mg • 12mg</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link to="/products" className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium group">
                    Explore Classic Collection
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Intense Collection Card */}
            <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-100 dark:border-surface-700 shadow-soft-xl overflow-hidden group">
              <div className="relative overflow-hidden">
                <img 
                  src="/images/products/peppermint-16mg.jpg" 
                  alt="PUXX Intense Collection" 
                  className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950 to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">PUXX Intense</h3>
                  <p className="text-surface-200 text-sm mt-1">Bold experiences for the discerning user</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-surface-700 dark:text-surface-300">
                  For those who seek more pronounced sensations. PUXX Intense delivers 
                  higher nicotine content paired with bold, distinctive flavor profiles
                  crafted for maximum satisfaction.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-surface-900 dark:text-white">Peppermint</span>
                    <span className="text-xs font-medium text-surface-500 px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800">16mg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-surface-900 dark:text-white">Cherry</span>
                    <span className="text-xs font-medium text-surface-500 px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800">16mg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-surface-900 dark:text-white">Spearmint</span>
                    <span className="text-xs font-medium text-surface-500 px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800">16mg • 22mg</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link to="/products" className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium group">
                    Discover Intense Collection
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Light Collection Card */}
            <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-100 dark:border-surface-700 shadow-soft-xl overflow-hidden group">
              <div className="relative overflow-hidden">
                <img 
                  src="/images/products/cool-mint-6mg.jpg" 
                  alt="PUXX Light Collection" 
                  className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950 to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">PUXX Light</h3>
                  <p className="text-surface-200 text-sm mt-1">Gentle introduction to premium satisfaction</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-surface-700 dark:text-surface-300">
                  A gentle entry point for those new to nicotine pouches. PUXX Light features
                  milder nicotine content with sophistication and nuance, offering an accessible
                  yet refined experience.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-surface-900 dark:text-white">Cool Mint</span>
                    <span className="text-xs font-medium text-surface-500 px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800">6mg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-surface-900 dark:text-white">Watermelon</span>
                    <span className="text-xs font-medium text-surface-500 px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800">6mg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-surface-900 dark:text-white">Cherry</span>
                    <span className="text-xs font-medium text-surface-500 px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800">6mg</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link to="/products" className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium group">
                    Explore Light Collection
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section id="craftsmanship" className="relative py-24 overflow-hidden bg-white dark:bg-surface-900">
        {/* Background gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-950">
          <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4xMCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptLTUgMmg0djFoLTR2LTF6bTAgMmgxdi00aC0xdjR6TTI0IDMwaDR2MWgtNHYtMXptMCAyaDF2NGgtMXYtNHptLTUgMmg0djFoLTR2LTF6bTAgMmgxdi00aC0xdjR6bS0yLTEyaDR2MWgtNHYtMXptMCAyaDF2NGgtMXYtNHptLTUgMmg0djFoLTR2LTF6bTAgMmgxdi00aC0xdjR6bTI3LTEyaDR2MWgtNHYtMXptMCAyaDF2NGgtMXYtNHptLTUgMmg0djFoLTR2LTF6bTAgMmgxdi00aC0xdjR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>
        
        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Craftsmanship Story */}
            <div className="space-y-8">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-medium text-puxx-premium-800 dark:text-puxx-premium-400 bg-puxx-premium-100 dark:bg-puxx-premium-900/40 rounded-full mb-3">
                  Our Craft
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 dark:text-white">
                  The Artistry Behind <span className="text-puxx-premium-700 dark:text-puxx-premium-500">PUXX</span>
                </h2>
              </div>
              
              <p className="text-lg text-surface-700 dark:text-surface-300 leading-relaxed">
                In the serene Nordic laboratories where precision meets passion, PUXX nicotine 
                pouches are meticulously crafted by artisans of flavor science. Our tobacco-free 
                creations represent a perfect harmony of innovation and tradition, where each step 
                of the production process is guided by an unwavering commitment to excellence.
              </p>
              
              <p className="text-lg text-surface-700 dark:text-surface-300 leading-relaxed">
                Our master blenders begin with pharmaceutical-grade nicotine, extracted using a 
                proprietary process that ensures exceptional purity. This foundation is then paired 
                with carefully selected plant-based fibers that provide the perfect texture and 
                mouthfeel — discreet white pouches that never stain, yet deliver consistent 
                satisfaction with every use.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft p-6 border border-surface-100 dark:border-surface-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-puxx-premium-100 dark:bg-puxx-premium-900/50 flex items-center justify-center">
                      <Flask className="h-5 w-5 text-puxx-premium-600 dark:text-puxx-premium-400" />
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-surface-900 dark:text-white">Flavor Engineering</h3>
                  </div>
                  <p className="mt-4 text-surface-600 dark:text-surface-400">
                    Each variant undergoes extensive development in our flavor laboratory until 
                    achieving the perfect balance—immediate sensory impact with long-lasting satisfaction.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft p-6 border border-surface-100 dark:border-surface-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-puxx-premium-100 dark:bg-puxx-premium-900/50 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-puxx-premium-600 dark:text-puxx-premium-400" />
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-surface-900 dark:text-white">Uncompromising Quality</h3>
                  </div>
                  <p className="mt-4 text-surface-600 dark:text-surface-400">
                    Every batch undergoes rigorous testing at multiple stages, ensuring consistent 
                    nicotine distribution, moisture content, and flavor profile.
                  </p>
                </div>
              </div>
              
              <div className="pt-6">
                <Link to="/products" className="inline-flex items-center text-puxx-premium-700 dark:text-puxx-premium-400 font-medium hover:text-puxx-premium-800 dark:hover:text-puxx-premium-300 transition-colors group">
                  Discover our full crafting process
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            
            {/* Visual Representation of Craftsmanship */}
            <div className="relative">
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-puxx-premium-100 dark:bg-puxx-premium-900/30 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary-100 dark:bg-primary-900/30 rounded-full filter blur-3xl"></div>
              
              <div className="relative">
                {/* Main craftsmanship image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/images/products/medium_puxx_applemint_6mg_70739f44d0.jpg" 
                    alt="PUXX Craftsmanship Process" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-950/50 to-transparent">
                    <div className="absolute bottom-8 left-8">
                      <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs text-white font-medium">
                        Premium Production
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Precision indicator */}
                <div className="absolute top-8 right-8 sm:top-6 sm:right-6 md:top-8 md:right-8 bg-white dark:bg-surface-800 rounded-xl p-3 shadow-xl max-w-[180px]">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-puxx-premium-100 dark:bg-puxx-premium-900/50 flex items-center justify-center flex-shrink-0">
                      <Star className="h-4 w-4 text-puxx-premium-600 dark:text-puxx-premium-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-xs font-semibold text-surface-900 dark:text-white">Precision Engineering</h4>
                      <p className="mt-1 text-xs text-surface-600 dark:text-surface-400">
                        Calibrated to deliver optimal nicotine absorption
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Process step indicators */}
                <div className="absolute -bottom-6 left-10 bg-white dark:bg-surface-800 rounded-xl shadow-xl p-4 max-w-[240px]">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full border-2 border-puxx-premium-400 flex items-center justify-center">
                          <span className="text-sm font-bold text-puxx-premium-700 dark:text-puxx-premium-400">01</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-puxx-premium-600 border-2 border-white dark:border-surface-800"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-surface-900 dark:text-white">Ingredient Selection</h4>
                      <p className="mt-1 text-xs text-surface-600 dark:text-surface-400">
                        Premium sources from certified global suppliers
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-surface-100 dark:border-surface-700">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-puxx-premium-600"></div>
                        <span className="ml-2 text-xs text-surface-600 dark:text-surface-400">Step 1 of 5</span>
                      </div>
                      <Link to="/products" className="text-xs text-puxx-premium-700 dark:text-puxx-premium-400 font-medium">
                        View All Steps
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section - Strength Calibration */}
      <section id="experience" className="py-24 bg-gradient-to-br from-surface-950 via-surface-900 to-primary-950">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-medium text-puxx-premium-400 bg-puxx-premium-900/40 rounded-full mb-3">
              Precision Experience
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Precisely Calibrated Strengths
            </h2>
            <p className="mt-4 text-lg text-surface-300 max-w-3xl mx-auto">
              Available in meticulously calibrated strengths ranging from Light (6mg) to 
              Extra Strong (22mg), PUXX pouches offer an experience tailored to your personal preference.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 relative group hover:bg-white/10 transition-colors duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 rounded-t-xl"></div>
              <h4 className="text-lg font-semibold text-white">Light</h4>
              <p className="text-3xl font-bold text-green-400 mt-2">6mg</p>
              <p className="mt-3 text-sm text-surface-300">
                Subtle introduction with gentle delivery for a mild, approachable experience.
              </p>
              <div className="mt-4 w-full h-1.5 rounded-full bg-surface-700 overflow-hidden">
                <div className="w-1/4 h-full bg-green-500"></div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 relative group hover:bg-white/10 transition-colors duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500 rounded-t-xl"></div>
              <h4 className="text-lg font-semibold text-white">Regular</h4>
              <p className="text-3xl font-bold text-yellow-400 mt-2">12mg</p>
              <p className="mt-3 text-sm text-surface-300">
                Balanced satisfaction with our signature release profile for everyday enjoyment.
              </p>
              <div className="mt-4 w-full h-1.5 rounded-full bg-surface-700 overflow-hidden">
                <div className="w-2/4 h-full bg-yellow-500"></div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 relative group hover:bg-white/10 transition-colors duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500 rounded-t-xl"></div>
              <h4 className="text-lg font-semibold text-white">Strong</h4>
              <p className="text-3xl font-bold text-orange-400 mt-2">16mg</p>
              <p className="mt-3 text-sm text-surface-300">
                Elevated nicotine content with robust delivery for a more pronounced experience.
              </p>
              <div className="mt-4 w-full h-1.5 rounded-full bg-surface-700 overflow-hidden">
                <div className="w-3/4 h-full bg-orange-500"></div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 relative group hover:bg-white/10 transition-colors duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 rounded-t-xl"></div>
              <h4 className="text-lg font-semibold text-white">Extra Strong</h4>
              <p className="text-3xl font-bold text-red-400 mt-2">22mg</p>
              <p className="mt-3 text-sm text-surface-300">
                Maximum intensity formulated for experienced users seeking profound satisfaction.
              </p>
              <div className="mt-4 w-full h-1.5 rounded-full bg-surface-700 overflow-hidden">
                <div className="w-full h-full bg-red-500"></div>
              </div>
            </div>
          </div>
          
          {/* Premium Features Comparison */}
          <div className="mt-24 relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <div className="p-1 bg-gradient-to-r from-puxx-premium-500/20 via-puxx-premium-500/10 to-puxx-premium-500/20 absolute top-0 left-0 right-0"></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-900/50">
                    <th className="py-6 px-6 text-left text-sm font-medium text-surface-300 uppercase tracking-wider">Features</th>
                    <th className="py-6 px-6 text-center">
                      <span className="block text-puxx-premium-400 text-lg font-bold">PUXX Premium</span>
                      <span className="block text-surface-400 text-sm mt-1">The Gold Standard</span>
                    </th>
                    <th className="py-6 px-6 text-center">
                      <span className="block text-surface-200 text-lg font-bold">Traditional Pouches</span>
                      <span className="block text-surface-400 text-sm mt-1">Industry Average</span>
                    </th>
                    <th className="py-6 px-6 text-center">
                      <span className="block text-surface-300 text-lg font-bold">Tobacco Products</span>
                      <span className="block text-surface-500 text-sm mt-1">Conventional Options</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-5 px-6 text-sm font-medium text-white">Nicotine Purity</td>
                    <td className="py-5 px-6 text-center">
                      <span className="flex items-center justify-center">
                        <span className="text-puxx-premium-400 font-semibold">Pharmaceutical Grade</span>
                        <CheckCircle2 className="ml-2 h-5 w-5 text-puxx-premium-400" />
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center text-surface-400">Standard</td>
                    <td className="py-5 px-6 text-center text-surface-500">Tobacco-derived</td>
                  </tr>
                  <tr>
                    <td className="py-5 px-6 text-sm font-medium text-white">Flavor Duration</td>
                    <td className="py-5 px-6 text-center">
                      <span className="flex items-center justify-center">
                        <span className="text-puxx-premium-400 font-semibold">60+ Minutes</span>
                        <CheckCircle2 className="ml-2 h-5 w-5 text-puxx-premium-400" />
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center text-surface-400">30-45 Minutes</td>
                    <td className="py-5 px-6 text-center text-surface-500">15-20 Minutes</td>
                  </tr>
                  <tr>
                    <td className="py-5 px-6 text-sm font-medium text-white">Staining</td>
                    <td className="py-5 px-6 text-center">
                      <span className="flex items-center justify-center">
                        <span className="text-puxx-premium-400 font-semibold">None</span>
                        <CheckCircle2 className="ml-2 h-5 w-5 text-puxx-premium-400" />
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center text-surface-400">Minimal</td>
                    <td className="py-5 px-6 text-center text-surface-500">Significant</td>
                  </tr>
                  <tr>
                    <td className="py-5 px-6 text-sm font-medium text-white">Odor</td>
                    <td className="py-5 px-6 text-center">
                      <span className="flex items-center justify-center">
                        <span className="text-puxx-premium-400 font-semibold">Odorless</span>
                        <CheckCircle2 className="ml-2 h-5 w-5 text-puxx-premium-400" />
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center text-surface-400">Subtle</td>
                    <td className="py-5 px-6 text-center text-surface-500">Strong</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-puxx-premium-600 text-white font-premium font-medium tracking-wide shadow-md transition-all hover:bg-puxx-premium-700 focus:outline-none focus:ring-2 focus:ring-puxx-premium-500 focus:ring-offset-2 focus:ring-offset-surface-900"
            >
              Experience the PUXX Difference
            </Link>
            <p className="mt-4 text-sm text-surface-400">
              For adult nicotine users only. These products contain nicotine, an addictive chemical.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white dark:bg-surface-900">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-medium text-primary-800 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 rounded-full mb-3">
              PUXX Community
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 dark:text-white">
              Stories of Satisfaction
            </h2>
            <p className="mt-4 text-lg text-surface-600 dark:text-surface-400 max-w-3xl mx-auto">
              Join thousands of discerning adults who have elevated their nicotine experience with PUXX premium pouches.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft overflow-hidden border border-surface-100 dark:border-surface-700">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                
                <blockquote className="text-surface-700 dark:text-surface-300 font-medium italic">
                  "I've tried every nicotine pouch brand on the market, and nothing compares to PUXX. The Spearmint 16mg delivers consistent satisfaction that lasts for over an hour, with a flavor that remains vibrant until the end."
                </blockquote>
                
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-surface-700 dark:text-surface-300 font-bold">
                    MS
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-surface-900 dark:text-white">Michael S.</h4>
                    <p className="text-xs text-surface-500">PUXX Spearmint Enthusiast</p>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-surface-500 dark:text-surface-500 flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <svg className="mr-1.5 h-2 w-2 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Verified Customer
                  </span>
                  <span className="ml-2">3 months ago</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft overflow-hidden border border-surface-100 dark:border-surface-700">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                
                <blockquote className="text-surface-700 dark:text-surface-300 font-medium italic">
                  "As someone who's been using nicotine products for years, discovering PUXX was a revelation. The Apple Mint 12mg has become my daily go-to. The white pouches leave no stains, and the flavor profile is leagues ahead of anything else I've tried."
                </blockquote>
                
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-surface-700 dark:text-surface-300 font-bold">
                    AL
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-surface-900 dark:text-white">Alexander L.</h4>
                    <p className="text-xs text-surface-500">PUXX Apple Mint Enthusiast</p>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-surface-500 dark:text-surface-500 flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <svg className="mr-1.5 h-2 w-2 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Verified Customer
                  </span>
                  <span className="ml-2">5 months ago</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft overflow-hidden border border-surface-100 dark:border-surface-700">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                
                <blockquote className="text-surface-700 dark:text-surface-300 font-medium italic">
                  "PUXX has mastered what others haven't even attempted. The Cool Mint 6mg is perfect for my lifestyle — discreet, clean, and consistently satisfying. I appreciate how the pouches maintain their shape and comfort throughout use. Simply unmatched quality."
                </blockquote>
                
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-surface-700 dark:text-surface-300 font-bold">
                    JT
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-surface-900 dark:text-white">Jennifer T.</h4>
                    <p className="text-xs text-surface-500">PUXX Cool Mint Enthusiast</p>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-surface-500 dark:text-surface-500 flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <svg className="mr-1.5 h-2 w-2 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Verified Customer
                  </span>
                  <span className="ml-2">2 months ago</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/products" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-surface-800 dark:bg-white text-white dark:text-surface-900 font-premium font-medium tracking-wide shadow-md transition-all hover:bg-surface-900 dark:hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-surface-500 focus:ring-offset-2">
              Join the PUXX Community
            </Link>
            <p className="mt-4 text-sm text-surface-500 dark:text-surface-400">
              Share your PUXX experience and connect with other enthusiasts.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-puxx-premium-700 to-puxx-premium-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute h-60 w-60 rounded-full bg-white blur-3xl animate-pulse-premium left-1/3 top-1/3"></div>
          <div className="absolute h-40 w-40 rounded-full bg-white blur-3xl animate-pulse-premium animation-delay-1000 right-1/3 bottom-1/3"></div>
        </div>
        
        <div className="max-w-7xl relative z-10 mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white">
              <span className="block mb-2">Experience Nicotine Reimagined</span>
              <span className="block text-puxx-premium-200">Join the Premium PUXX Movement</span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-puxx-premium-100">
              Elevate your nicotine experience with our meticulously crafted tobacco-free pouches,
              designed for those who demand more from every moment.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-puxx-premium-900 bg-white hover:bg-puxx-premium-50 shadow-xl transition-all"
              >
                Shop Premium Pouches
              </Link>
              
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-base font-medium rounded-md text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
              >
                Explore Flavors
              </Link>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-puxx-premium-200">
              These products contain nicotine. Nicotine is an addictive chemical. For adult use only.
            </p>
          </div>
        </div>
      </section>

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

export default LandingPage;