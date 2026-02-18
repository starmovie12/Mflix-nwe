'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/tv', label: 'TV Shows' },
    { href: '/new-popular', label: 'New & Popular' },
    { href: '/my-list', label: 'My List' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-mflix-black/95 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[1920px] items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-2xl font-bold text-mflix-red transition-colors hover:text-mflix-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mflix-red focus-visible:ring-offset-2 focus-visible:ring-offset-mflix-black"
            aria-label="MFLIX Home"
          >
            MFLIX
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-mflix-gray-100 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="rounded-full p-2 text-mflix-gray-100 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mflix-red"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="rounded-full p-2 text-mflix-gray-100 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mflix-red"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="rounded-full p-2 text-mflix-gray-100 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mflix-red md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-mflix-black/98 md:hidden"
          >
            <ul className="flex flex-col gap-2 px-4 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2 text-mflix-gray-100 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
