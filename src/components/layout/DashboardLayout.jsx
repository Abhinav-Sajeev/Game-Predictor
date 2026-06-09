import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const DashboardLayout = ({ globalSearchQuery, setGlobalSearchQuery }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Generate dynamic breadcrumbs
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    
    return (
      <nav className="flex items-center gap-1.5 text-xs text-text-secondary-dark/70 font-semibold mb-6 flex-wrap uppercase tracking-wider font-display bg-white/2 border border-white/5 py-2.5 px-4 rounded-xl max-w-fit">
        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1 select-none">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          
          // Format label
          let label = name.replace("-", " ");
          if (label.toLowerCase() === "predictions") label = "my predictions";

          return (
            <React.Fragment key={name}>
              <ChevronRight className="w-3 h-3 text-text-secondary-dark/40" />
              {isLast ? (
                <span className="text-primary font-bold">{label}</span>
              ) : (
                <Link to={routeTo} className="hover:text-primary transition-colors">
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-dark text-white dark:bg-bg-dark dark:text-white light:bg-bg-light light:text-text-primary-light transition-colors duration-300">
      
      {/* Navbar Header */}
      <Navbar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        globalSearchQuery={globalSearchQuery}
        setGlobalSearchQuery={setGlobalSearchQuery}
      />

      <div className="flex flex-1 pt-20">
        {/* Sidebar Drawer/Panel */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Core Layout Main Section */}
        <main className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-300">
          <div className="flex-1 p-4 md:p-8 flex flex-col">
            
            {/* Dynamic Breadcrumbs */}
            {getBreadcrumbs()}

            {/* Injected Nested Page Content */}
            <div className="flex-grow flex flex-col">
              <Outlet />
            </div>

          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
