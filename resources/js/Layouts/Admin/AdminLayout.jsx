import React, { useState, useEffect } from "react";
import Sidebar from "./Partials/Sidebar/Sidebar";
import Header from "./Partials/Header/Header";
import { Head, usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";

const AdminLayout = ({ children, title = "Dashboard" }) => {
  const { flash } = usePage().props;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState("light");
  const [pageReady, setPageReady] = useState(false);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                position: 'top-right',
                autoClose: 1500,
            })
        }

        if (flash.error) {
            toast.error(flash.error, {
                position: 'top-right',
                autoClose: 1500,
            })
        }
    }, [flash]);

  // Handle window resize and mobile detection
  useEffect(() => {
    const checkMobile = () => window.innerWidth < 1024;

    const handleResize = () => {
      const mobile = checkMobile();

      if (mobile !== isMobile) {
        setIsMobile(mobile);
        if (mobile) {
          setSidebarOpen(false);
        } else {
          const savedState = localStorage.getItem('sidebarOpen');
          setSidebarOpen(savedState === null ? true : savedState === 'true');
        }
      }
    };

    const initTimer = setTimeout(() => {
      handleResize();
      setPageReady(true);
    }, 50);

    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
      clearTimeout(initTimer);
    };
  }, [isMobile]);

  // Theme handling
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    if (!isMobile) {
      localStorage.setItem('sidebarOpen', newState.toString());
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    if (!isMobile) {
      localStorage.setItem('sidebarOpen', 'false');
    }
  };

  if (!pageReady) return null;

  return (
    <>
      <Head>
        <title>{`${title} - NextGen Admin`}</title>
      </Head>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'dark:bg-gray-800 dark:text-white'
        }}
        
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            sidebarOpen={sidebarOpen}
            closeSidebar={closeSidebar}
            isMobile={isMobile}
          />

          <div
            className={`
              flex-1 flex flex-col min-w-0
              transition-all duration-300 ease-in-out
              ${sidebarOpen && !isMobile ? 'lg:pl-64' : ''}
            `}
          >
            <Header
              toggleSidebar={toggleSidebar}
              sidebarOpen={sidebarOpen}
              isMobile={isMobile}
              theme={theme}
              toggleTheme={toggleTheme}
            />

            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              <div className="py-2 sm:py-4">
                <div className="px-3 sm:px-2 lg:px-3 mx-auto w-full">
                  <div className="relative">
                    <div className="overflow-hidden">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
