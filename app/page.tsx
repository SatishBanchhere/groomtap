// app/page.tsx
'use client'
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { User } from '@/types';

import {auth, googleProvider,signInWithPopup} from "@/lib/firebase";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const handleSignIn = async () => {
    try{
      console.log("signIn");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      localStorage.setItem('access_token', token);
    }
    catch(err){
      console.error(err);
    }
  };

  return (
      <div className="min-h-screen bg-white">
        <Navbar onSignInClick={() => setIsAuthModalOpen(true)} />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Your Perfect
                <span className="text-blue-600"> Grooming</span>
                <br />Experience Awaits
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Connect with skilled barbers and top-rated shops in your area. Book appointments,
                manage your grooming schedule, and look your best every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn-primary text-lg px-8 py-4"
                >
                  Get Started
                </button>
                <button className="btn-secondary text-lg px-8 py-4">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose GroomTap?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We make finding and booking grooming services simple and convenient for everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Easy Discovery</h3>
                <p className="text-gray-600">
                  Find the best barbers and shops near you with detailed profiles, reviews, and ratings.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Booking</h3>
                <p className="text-gray-600">
                  Book appointments instantly with real-time availability and automated reminders.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality Assured</h3>
                <p className="text-gray-600">
                  All professionals are verified with customer reviews and quality guarantees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How GroomTap Works
              </h2>
              <p className="text-xl text-gray-600">
                Get groomed in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Choose Your Service</h3>
                <p className="text-gray-600">
                  Browse through barbers and shops in your area. Check their services, prices, and availability.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Book Appointment</h3>
                <p className="text-gray-600">
                  Select your preferred time slot and book instantly. Get confirmation and reminders.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Groomed</h3>
                <p className="text-gray-600">
                  Arrive at your appointment and enjoy professional grooming services. Rate your experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Grooming Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of satisfied customers and professional barbers on GroomTap today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
              >
                Start Now - It&#39;s Free
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg">
                Learn More
              </button>
            </div>
          </div>
        </section>

        <Footer />

        <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSignIn={handleSignIn}
        />
      </div>
  );
}
