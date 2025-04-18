'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <motion.div
            className="h-screen flex flex-col items-center justify-center bg-[#1B2233] text-[#E0E0E0] px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.h1
                className="text-7xl font-extrabold mb-4 text-[#A78BFA]"
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Lost in Space?
            </motion.h1>

            <motion.p
                className="text-lg max-w-xl mb-8 text-[#E0E0E0]/80"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                Looks like the page you're looking for doesn't exist. But no worries —
                you can always head back home 🚀
            </motion.p>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
            >
                <Link href="/">
                    <button className="bg-[#6D28D9] hover:bg-[#7C3AED] text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300">
                        Take Me Home
                    </button>
                </Link>
            </motion.div>
        </motion.div>
    );
}
