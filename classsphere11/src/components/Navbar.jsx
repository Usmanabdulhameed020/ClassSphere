import React, { useEffect, useState } from "react";
import { Search, UserCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-2 sm:px-4 transition-all duration-300">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-7xl px-4 sm:px-6 py-3 rounded-2xl flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg border border-white/20"
            : "bg-white/10 backdrop-blur-md border border-white/10"
        }`}
      >
        {/* Logo */}
        <Link to="/">
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            whileHover="hover"
          >
            <motion.div 
              variants={{
                hover: { rotate: [0, -10, 10, 0], scale: 1.05 }
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <img src="/logo.png" alt="ClassSphere Logo" className="w-12 h-7 sm:w-15 sm:h-9 object-contain" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Class<span className="text-teal-600">Sphere</span>
            </h1>
          </motion.div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Link
                to={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(20, 184, 166, 0.1)" }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full text-slate-600 hover:text-teal-600"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(20, 184, 166, 0.1)" }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full text-slate-600 hover:text-teal-600"
              >
                <UserCircle className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>

          <Link to="/contact">
            <motion.div
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 20px 25px -5px rgba(13, 148, 136, 0.3)",
                backgroundColor: "#0d9488"
              }}
              whileTap={{ scale: 0.98 }}
              className="px-3 sm:px-6 py-2.5 bg-teal-600 text-white font-bold rounded-xl shadow-md transition-all text-xs sm:text-base inline-block"
              aria-label="Contact Us"
            >
              Contact Us
            </motion.div>
          </Link>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-2xl rounded-3xl border border-teal-50 shadow-2xl overflow-hidden lg:hidden"
          >
            <div className="p-6 flex flex-col gap-2">
              {navLinks.map((link, idx) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-lg font-medium text-slate-900 p-3 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-all"
                  >
                    {link.name}
                  </motion.div>
                </Link>
              ))}
              <hr className="border-slate-100 my-2" />
              <div className="flex flex-col gap-3">
                <div className="flex justify-center gap-6 py-2">
                  <Search className="w-6 h-6 text-slate-600" />
                  <UserCircle className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

