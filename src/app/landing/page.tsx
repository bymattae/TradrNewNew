'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}
      <nav className="py-6 px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md"></div>
          <span className="font-bold text-xl">Tradr</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/join" className="text-white/70 hover:text-white transition-colors">
            Login
          </Link>
          <Link 
            href="/onboarding" 
            className="bg-gradient-to-r from-purple-600 to-purple-800 px-4 py-2 rounded-md flex items-center gap-2 font-medium"
          >
            Get Started <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-10 py-16 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Share Your Trading Success<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">With the World</span>
          </h1>
          <p className="text-xl text-white/70 mb-10 max-w-2xl">
            Create a beautiful profile to showcase your trading strategies, insights, and metrics - all in one place.
          </p>
          <Link 
            href="/questions" 
            className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-4 rounded-full flex items-center gap-2 font-medium text-lg"
          >
            Create Your Tradr Profile <FiArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-10 py-20 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Use Tradr</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] p-8 rounded-xl">
              <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Showcase Your Performance</h3>
              <p className="text-white/70">Display your trading metrics, win rates, and profitability to build credibility with your audience.</p>
            </div>

            <div className="bg-[#1A1A1A] p-8 rounded-xl">
              <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Monetize Your Expertise</h3>
              <p className="text-white/70">Sell premium courses, strategies, or offer membership access to your real-time trades and analysis.</p>
            </div>

            <div className="bg-[#1A1A1A] p-8 rounded-xl">
              <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Build in Minutes</h3>
              <p className="text-white/70">Create your professional trading profile in just minutes, with no coding or technical skills required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Preview Section */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">What Your Profile Could Look Like</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join thousands of traders who are building their personal brand online
          </p>
          
          <div className="bg-[#151515] rounded-2xl p-8 max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 p-[2px]">
                  <div className="rounded-full bg-[#1A1A1A] w-full h-full flex items-center justify-center text-xl font-bold">
                    TJ
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-1">TradingJohn</h3>
              <p className="text-white/70 mb-3">Crypto & Forex Trader</p>
              
              <div className="flex gap-2 mb-6">
                <span className="px-2 py-1 text-xs rounded-full bg-[rgba(255,255,255,0.05)] text-white/70">
                  #bitcoin
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-[rgba(255,255,255,0.05)] text-white/70">
                  #forex
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-[rgba(255,255,255,0.05)] text-white/70">
                  #swing
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 w-full mb-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-500">+64%</p>
                  <p className="text-xs text-white/70">YTD Return</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-500">78%</p>
                  <p className="text-xs text-white/70">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-500">1:3</p>
                  <p className="text-xs text-white/70">Risk/Reward</p>
                </div>
              </div>
              
              <button className="bg-gradient-to-r from-purple-600 to-purple-800 w-full py-3 rounded-xl font-medium">
                Premium Membership
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 md:px-10 py-16 bg-[#111111]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Trading Journey?</h2>
          <p className="text-xl text-white/70 mb-10">
            Create your Tradr profile in minutes and start sharing your trading expertise with the world.
          </p>
          <Link 
            href="/questions" 
            className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-4 rounded-full inline-flex items-center gap-2 font-medium text-lg"
          >
            Get Started Now <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="px-6 md:px-10 py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md"></div>
            <span className="font-bold">Tradr</span>
          </div>
          <div className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Tradr. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 