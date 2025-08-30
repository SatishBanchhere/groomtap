// app/components/Navbar.tsx
'use client'
import { useState } from 'react';
import { NavbarProps } from '../types';

const Navbar: React.FC<NavbarProps> = ({ onSignInClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m3 0V1.5A1.5 1.5 0 0014.5 0h-5A1.5 1.5 0 008 1.5V4m8 0H8m8 0v16H8V4" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">GroomTap</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                            How It Works
                        </a>
                        <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                            About
                        </a>
                        <button
                            onClick={onSignInClick}
                            className="btn-primary"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-blue-600 p-2"
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                                Features
                            </a>
                            <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                                How It Works
                            </a>
                            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                                About
                            </a>
                            <button
                                onClick={onSignInClick}
                                className="w-full text-left px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mt-2"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
