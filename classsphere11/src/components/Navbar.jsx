import React, { useEffect, useState, useRef, useCallback } from "react";
import { 
  Search, 
  UserCircle, 
  Menu, 
  X, 
  ArrowRight, 
  Clock, 
  TrendingUp,
  HelpCircle,
  Building2,
  Zap,
  Mail,
  Bot,
  Gem,
  Puzzle,
  BookOpen,
  Server,
  GraduationCap,
  Gamepad2,
  BarChart3,
  Layout,
  Shield,
  FileCheck,
  Lock,
  Key,
  Rocket,
  Briefcase,
  FileText,
  Scroll,
  Home,
  Sparkles,
  RefreshCw,
  Sliders,
  Globe,
  LineChart,
  Users,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import searchData from "../searchData";

const IconMap = {
  building: Building2,
  zap: Zap,
  mail: Mail,
  bot: Bot,
  gem: Gem,
  puzzle: Puzzle,
  notebook: BookOpen,
  diamond: Gem,
  server: Server,
  graduation: GraduationCap,
  gamepad: Gamepad2,
  "bar-chart": BarChart3,
  layout: Layout,
  shield: Shield,
  check: FileCheck,
  lock: Lock,
  key: Key,
  rocket: Rocket,
  briefcase: Briefcase,
  "file-text": FileText,
  scroll: Scroll,
  home: Home,
  sparkles: Sparkles,
  refresh: RefreshCw,
  sliders: Sliders,
  globe: Globe,
  "line-chart": LineChart,
  users: Users,
  target: Target,
};

function SearchItemIcon({ iconName, className = "w-5 h-5" }) {
  const IconComponent = IconMap[iconName] || HelpCircle;
  return <IconComponent className={className} />;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);

  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cs_recent_searches") || "[]");
      setRecentSearches(saved.slice(0, 5));
    } catch {
      setRecentSearches([]);
    }
  }, []);

  // Save a recent search
  const saveRecentSearch = useCallback((query) => {
    const updated = [query, ...recentSearches.filter((r) => r !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("cs_recent_searches", JSON.stringify(updated));
  }, [recentSearches]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Open search with Ctrl/Cmd + K
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  // Fuzzy search logic
  const performSearch = useCallback((query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSelectedIndex(-1);
      return;
    }

    const q = query.toLowerCase().trim();
    const scored = searchData.map((item) => {
      let score = 0;

      // Exact name match (highest priority)
      if (item.name.toLowerCase() === q) score += 100;
      // Name starts with query
      else if (item.name.toLowerCase().startsWith(q)) score += 80;
      // Name contains query
      else if (item.name.toLowerCase().includes(q)) score += 60;

      // Description match
      if (item.description.toLowerCase().includes(q)) score += 30;

      // Keyword match
      item.keywords.forEach((kw) => {
        if (kw.toLowerCase() === q) score += 50;
        else if (kw.toLowerCase().startsWith(q)) score += 35;
        else if (kw.toLowerCase().includes(q)) score += 15;
      });

      // Category match
      if (item.category.toLowerCase().includes(q)) score += 20;

      return { ...item, score };
    });

    const filtered = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    setSearchResults(filtered);
    setSelectedIndex(filtered.length > 0 ? 0 : -1);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => performSearch(searchQuery), 120);
    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // Navigate to a search result
  const navigateToResult = useCallback((result) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
    }
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedIndex(-1);
    setMobileMenuOpen(false);

    if (result.section && result.route === "/") {
      // For landing page sections, navigate to "/" and scroll to section
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(result.section);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    } else {
      navigate(result.route);
    }
  }, [navigate, searchQuery, saveRecentSearch]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        navigateToResult(searchResults[selectedIndex]);
      }
    }
  };

  // Popular/trending suggestions when search is empty
  const trendingSuggestions = searchData.filter((item) =>
    ["ClassSphere AI", "Live Demo", "Services", "NotebookLM", "Security"].includes(item.name)
  );

  // Group results by category
  const groupedResults = searchResults.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
  ];

  // Calculate flat index for keyboard navigation in grouped results
  let flatIndex = 0;
  const getFlatIndex = () => flatIndex++;

  // ─── SEARCH DROPDOWN COMPONENT ──────────────────────────
  const SearchDropdown = ({ isMobile = false }) => {
    flatIndex = 0; // Reset for each render
    return (
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute ${isMobile ? "left-0 right-0 top-full mt-2" : "left-0 right-0 top-full mt-2"} bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100]`}
            style={{
              maxHeight: isMobile ? "60vh" : "420px",
              boxShadow: "0 25px 60px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.03)",
            }}
          >
            <div className="overflow-y-auto" style={{ maxHeight: isMobile ? "60vh" : "420px" }}>
              {/* No query — show recent + trending */}
              {!searchQuery.trim() && (
                <div className="p-3">
                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <Clock className="w-3 h-3" />
                        Recent
                      </div>
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchQuery(term);
                            performSearch(term);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Clock className="w-3.5 h-3.5 text-slate-300" />
                          {term}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Trending suggestions */}
                  <div>
                    <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <TrendingUp className="w-3 h-3" />
                      Popular
                    </div>
                    {trendingSuggestions.map((item) => (
                      <button
                        key={item.route + (item.section || "")}
                        onClick={() => navigateToResult(item)}
                        className="w-full text-left px-3 py-2.5 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-3 group"
                      >
                        <span className="w-7 flex justify-center shrink-0 text-slate-500 group-hover:text-teal-600 transition-colors">
                          <SearchItemIcon iconName={item.icon} className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800 group-hover:text-teal-700 truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-400 truncate">{item.description}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search results */}
              {searchQuery.trim() && searchResults.length > 0 && (
                <div className="p-3">
                  {Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category} className="mb-2 last:mb-0">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {category}
                      </div>
                      {items.map((item) => {
                        const idx = getFlatIndex();
                        return (
                          <button
                            key={item.route + (item.section || "")}
                            onClick={() => navigateToResult(item)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 group ${
                              selectedIndex === idx
                                ? "bg-teal-50 ring-1 ring-teal-200"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <span className="w-7 flex justify-center shrink-0 text-slate-500 group-hover:text-teal-600 transition-colors">
                              <SearchItemIcon iconName={item.icon} className="w-5 h-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div
                                className={`text-sm font-semibold truncate ${
                                  selectedIndex === idx ? "text-teal-700" : "text-slate-800"
                                }`}
                              >
                                {highlightMatch(item.name, searchQuery)}
                              </div>
                              <div className="text-xs text-slate-400 truncate">{item.description}</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-medium text-slate-300 bg-slate-50 px-2 py-0.5 rounded-md">
                                {item.route}
                              </span>
                              <ArrowRight
                                className={`w-3.5 h-3.5 transition-all ${
                                  selectedIndex === idx
                                    ? "text-teal-500 opacity-100"
                                    : "text-slate-300 opacity-0 group-hover:opacity-100"
                                }`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* No results */}
              {searchQuery.trim() && searchResults.length === 0 && (
                <div className="p-8 text-center">
                  <div className="flex justify-center mb-3 text-slate-300">
                    <Search className="w-10 h-10" />
                  </div>
                  <div className="text-sm font-semibold text-slate-700 mb-1">
                    No results for "{searchQuery}"
                  </div>
                  <div className="text-xs text-slate-400">
                    Try searching for pages, features, or topics
                  </div>
                </div>
              )}

              {/* Footer hint */}
              <div className="border-t border-slate-100 px-4 py-2 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono text-[10px] shadow-sm">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono text-[10px] shadow-sm">↵</kbd>
                    Open
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono text-[10px] shadow-sm">Esc</kbd>
                    Close
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-teal-600 bg-teal-50 rounded px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

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
                hover: { rotate: [0, -10, 10, 0], scale: 1.05 },
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
          <AnimatePresence mode="wait">
            {!isSearchOpen ? (
              <motion.div
                key="links"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-8 xl:gap-10"
              >
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
              </motion.div>
            ) : (
              <motion.div
                key="search"
                ref={searchContainerRef}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "420px" }}
                exit={{ opacity: 0, width: 0 }}
                className="relative"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search pages, features, topics..."
                    className="w-full bg-slate-100/80 border border-slate-200/60 rounded-xl pl-10 pr-16 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/40 focus:border-teal-300 focus:bg-white outline-none transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <kbd className="hidden xl:inline-flex bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono text-[10px] text-slate-400 shadow-sm">
                      ESC
                    </kbd>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <SearchDropdown />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(20, 184, 166, 0.1)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (!isSearchOpen) {
                  setTimeout(() => searchInputRef.current?.focus(), 150);
                } else {
                  setSearchQuery("");
                  setSearchResults([]);
                }
              }}
              className="hidden lg:flex items-center gap-2 p-2 rounded-full text-slate-600 hover:text-teal-600"
              title="Search (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </motion.button>
          </div>

          {/* User Profile / Auth Icon */}
          <div className="hidden lg:flex items-center mx-1">
            {user ? (
              <Link to="/dashboard" className="transition-all active:scale-95">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 hover:ring-4 hover:ring-teal-500/20 transition-all shadow-inner"
                  />
                ) : (
                  <div className="w-10 h-10 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full flex items-center justify-center text-sm transition-all shadow-inner">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(20, 184, 166, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full text-slate-600 hover:text-teal-600 transition-all"
                  title="Login / Register"
                >
                  <UserCircle className="w-6 h-6" />
                </motion.button>
              </Link>
            )}
          </div>

          <Link to="/contact">
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(13, 148, 136, 0.3)",
                backgroundColor: "#0d9488",
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

              {/* Mobile Search */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    ref={mobileSearchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!isSearchOpen) setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search pages, features..."
                    className="w-full bg-slate-100 border-none rounded-2xl pl-10 pr-5 py-3 text-base focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                </div>

                {/* Mobile search results */}
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg"
                      style={{ maxHeight: "50vh", overflowY: "auto" }}
                    >
                      {/* Mobile: No query — show trending */}
                      {!searchQuery.trim() && (
                        <div className="p-3">
                          {recentSearches.length > 0 && (
                            <div className="mb-2">
                              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Recent
                              </div>
                              {recentSearches.map((term, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setSearchQuery(term);
                                    performSearch(term);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-2"
                                >
                                  <Clock className="w-3.5 h-3.5 text-slate-300" />
                                  {term}
                                </button>
                              ))}
                            </div>
                          )}
                          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Popular
                          </div>
                          {trendingSuggestions.map((item) => (
                            <button
                              key={item.route + (item.section || "")}
                              onClick={() => navigateToResult(item)}
                              className="w-full text-left px-3 py-2.5 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-3"
                            >
                              <span className="flex justify-center shrink-0 text-slate-500">
                                <SearchItemIcon iconName={item.icon} className="w-5 h-5" />
                              </span>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-800 truncate">{item.name}</div>
                                <div className="text-xs text-slate-400 truncate">{item.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Mobile: Results */}
                      {searchQuery.trim() && searchResults.length > 0 && (
                        <div className="p-3">
                          {searchResults.map((item, i) => (
                            <button
                              key={item.route + (item.section || "")}
                              onClick={() => navigateToResult(item)}
                              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 ${
                                selectedIndex === i ? "bg-teal-50" : "hover:bg-slate-50"
                              }`}
                            >
                              <span className="flex justify-center shrink-0 text-slate-500">
                                <SearchItemIcon iconName={item.icon} className="w-5 h-5" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-slate-800 truncate">
                                  {highlightMatch(item.name, searchQuery)}
                                </div>
                                <div className="text-xs text-slate-400 truncate">{item.description}</div>
                              </div>
                              <span className="text-[10px] text-slate-300 bg-slate-50 px-2 py-0.5 rounded-md shrink-0">
                                {item.route}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Mobile: No results */}
                      {searchQuery.trim() && searchResults.length === 0 && (
                        <div className="p-6 text-center">
                          <div className="flex justify-center mb-2 text-slate-300">
                            <Search className="w-8 h-8" />
                          </div>
                          <div className="text-sm font-semibold text-slate-700">No results for "{searchQuery}"</div>
                          <div className="text-xs text-slate-400 mt-1">Try different keywords</div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-center gap-6 py-2">
                {user ? (
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="transition-all active:scale-95">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <UserCircle className="w-6 h-6 text-slate-600 hover:text-teal-600 transition-colors" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
