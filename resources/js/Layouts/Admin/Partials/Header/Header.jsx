import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  HelpCircle,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { usePage, router } from "@inertiajs/react";
import NotificationPanel from "@/Components/Admin/Header/NotificationPanel";
import UserMenu from "@/Components/Admin/Header/UserMenu";

const Header = ({ toggleSidebar, toggleTheme, theme }) => {
  const { auth } = usePage().props;
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

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
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

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
        // Implement your search API call here
        // const response = await axios.get(`/api/search?q=${value}`);
        // setSearchResults(response.data);
        
        // Mock search results for now
        setSearchResults([
          { id: 1, type: 'user', title: 'John Doe', url: '/admin/users/1' },
          { id: 2, type: 'post', title: 'Sample Post', url: '/admin/posts/1' },
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
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <h1 className="hidden lg:block text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NextGen Dashboard
          </h1>
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
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:text-gray-200 transition-all duration-200"
            />
            
            {/* Search Results Dropdown */}
            {(searchResults.length > 0 || isSearching) && (
              <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                ) : (
                  searchResults.map((result) => (
                    <a
                      key={result.id}
                      href={result.url}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase mr-2">
                        {result.type}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {result.title}
                      </span>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200"
              aria-label="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200"
              aria-label="Language"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>

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
