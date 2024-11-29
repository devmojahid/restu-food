import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  HelpCircle,
  Globe,
  Sun,
  Moon,
  BellRing,
  MessageSquare,
  LayoutGrid,
  FileText,
  Shield,
  Plus,
  UserPlus,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { usePage, router, Link } from "@inertiajs/react";
import NotificationPanel from "@/Components/Admin/Header/NotificationPanel";
import UserMenu from "@/Components/Admin/Header/UserMenu";
import QuickActionsPanel from "@/Components/Admin/Header/QuickActionsPanel";

const Header = ({ toggleSidebar, sidebarOpen, isMobile, theme, toggleTheme }) => {
  const { auth } = usePage().props;
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const quickActionsRef = useRef(null);

  // Handle click outside to close menus
  const handleClickOutside = useCallback((event) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setUserMenuOpen(false);
    }
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setNotificationOpen(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchResults([]);
    }
    if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
      setQuickActionsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('#global-search')?.focus();
      }
      // Esc to close all dropdowns
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setNotificationOpen(false);
        setQuickActionsOpen(false);
        setSearchResults([]);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Debounced search function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Handle search with debounce
  const handleSearch = useCallback(
    debounce(async (value) => {
      if (!value.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Mock search results for now
        setSearchResults([
          { id: 1, type: 'user', title: 'John Doe', url: '/admin/users/1', icon: UserIcon },
          { id: 2, type: 'post', title: 'Sample Post', url: '/admin/posts/1', icon: FileText },
          { id: 3, type: 'setting', title: 'Security Settings', url: '/admin/settings/security', icon: Shield },
        ]);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  // Handle logout
  const handleLogout = () => {
    router.post(route("logout"));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm transition-colors duration-500 h-16 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-full px-4 2xl:px-6">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <Link
            href="/"
            target="_blank"
            className="hidden lg:inline-flex items-center px-4 py-2 border-2 border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <Globe className="w-4 h-4 mr-2" />
            View Website
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block" ref={searchRef}>
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                isSearchFocused ? "text-blue-500" : "text-gray-400"
              }`}
              size={18}
            />
            <input
              id="global-search"
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search anything... (Ctrl + K)"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:text-gray-200 transition-all duration-200"
            />
            
            {/* Search Results Dropdown */}
            {(searchResults.length > 0 || isSearching) && (
              <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-[400px] overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                ) : (
                  <div>
                    {searchResults.map((result) => (
                      <a
                        key={result.id}
                        href={result.url}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        {result.icon && <result.icon className="h-4 w-4 text-gray-400 mr-3" />}
                        <div>
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {result.title}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            in {result.type}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Quick Actions */}
          <QuickActionsPanel
            quickActionsRef={quickActionsRef}
            isOpen={quickActionsOpen}
            onToggle={() => setQuickActionsOpen(!quickActionsOpen)}
          />

          {/* Messages */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200 relative hidden sm:flex"
            aria-label="Messages"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-800"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200 hidden sm:flex"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <NotificationPanel
            notificationRef={notificationRef}
            isOpen={notificationOpen}
            onToggle={() => setNotificationOpen(!notificationOpen)}
          />

          {/* User menu */}
          <UserMenu
            userMenuRef={userMenuRef}
            isOpen={userMenuOpen}
            onToggle={() => setUserMenuOpen(!userMenuOpen)}
            user={auth?.user}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
