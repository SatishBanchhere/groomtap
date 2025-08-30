// app/components/Navbar.tsx
'use client'
import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { NavbarProps } from '@/types';
import {auth, googleProvider, signInWithPopup} from '@/lib/firebase'
import Link from 'next/link';

const Navbar: React.FC<NavbarProps> = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownRef]);

    const getInitial = (name: string | null): string => {
        if (!name || name.length === 0) return '';
        return name.charAt(0).toUpperCase();
    };

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

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('access_token');
            setIsDropdownOpen(false); // Close dropdown after sign out
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 cursor-pointer">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m3 0V1.5A1.5 1.5 0 0014.5 0h-5A1.5 1.5 0 008 1.5V4m8 0H8m8 0v16H8V4" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                            GroomTap
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/bookings" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                            My Bookings
                        </a>
                        <a href="/freelancers" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                            Freelancers
                        </a>
                        <a href="/shops" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                            Shops
                        </a>

                        {/* Conditional rendering based on user auth state */}
                        {!user ? (
                            <button
                                onClick={handleSignIn}
                                className="btn-primary"
                            >
                                Sign In
                            </button>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    aria-haspopup="true"
                                    aria-expanded={isDropdownOpen}
                                >
                                    {getInitial(user.displayName || user.email)}
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                        <div className="py-1">
                                            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                                                <div className="font-medium">{user.displayName || 'User'}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                            <button
                                                onClick={handleSignOut}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Logout
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
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

                            {/* Mobile auth state conditional rendering */}
                            {!user ? (
                                <button
                                    onClick={handleSignIn}
                                    className="w-full text-left px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mt-2"
                                >
                                    Sign In
                                </button>
                            ) : (
                                <div className="mt-2 border-t pt-2">
                                    <div className="flex items-center px-3 py-2">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold mr-3">
                                            {getInitial(user.displayName || user.email)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.displayName || 'User'}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 font-medium mt-1"
                                    >
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
