import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, Sun, Moon, LogOut, User, Settings, ChevronDown, Award } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { logo, defaultAvatar } from "../../assets";
import { cn } from "../../utils/helpers";

const Navbar = ({ toggleSidebar, globalSearchQuery, setGlobalSearchQuery }) => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const profileRef = useRef(null);
  const notifyRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Mock Notifications
  const notifications = [];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-bg-dark/75 dark:bg-bg-dark/75 light:bg-bg-light/75 backdrop-blur-md border-b border-white/10 dark:border-white/10 light:border-black/5 h-20 transition-all duration-300">
      <div className="h-full px-4 md:px-8 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburguer Trigger */}
          <button
            onClick={toggleSidebar}
            className="flex md:hidden p-2 text-text-secondary-dark hover:text-white dark:hover:text-white light:hover:text-bg-dark bg-white/5 border border-white/10 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="FIFA Predict" className="h-10 w-10 object-contain" />
            <span className="font-extrabold text-lg md:text-xl tracking-wider font-display uppercase bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FIFA Predict
            </span>
          </Link>
        </div>

        {/* Middle: Global Search (Desktop only) */}
        {setGlobalSearchQuery && (
          <div className="hidden md:flex items-center relative max-w-md w-full">
            <Search className="absolute left-3.5 w-4 h-4 text-text-secondary-dark" />
            <input
              type="text"
              placeholder="Search matches, tournaments, teams..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="w-full bg-card-dark/40 border border-white/10 rounded-xl py-2 pl-11 pr-4 text-sm text-white placeholder-text-secondary-dark/50 outline-none focus:border-primary/60 focus:bg-card-dark/60 light:bg-white/50 light:border-black/10 light:text-bg-dark"
            />
          </div>
        )}

        {/* Right Side: Quick Tools & Auth Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Theme Switcher */}
          {/* <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-text-secondary-dark hover:text-white dark:hover:text-white light:hover:text-bg-dark hover:bg-white/5 border border-white/10 dark:border-white/10 light:border-black/10 transition-colors focus:outline-none"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button> */}

          {/* Notifications bell */}
          <div className="relative" ref={notifyRef}>
            {/* <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl text-text-secondary-dark hover:text-white dark:hover:text-white light:hover:text-bg-dark hover:bg-white/5 border border-white/10 dark:border-white/10 light:border-black/10 transition-colors focus:outline-none"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border border-bg-dark dark:border-bg-dark animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button> */}

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 glass-panel border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 z-50 text-white light:text-bg-dark">
                <div className="flex justify-between items-center pb-2 border-b border-white/5 dark:border-white/5 light:border-black/5">
                  <span className="font-bold text-xs uppercase tracking-wider font-display text-primary">Notifications</span>
                  <span className="text-[10px] text-text-secondary-dark cursor-pointer hover:text-white dark:hover:text-white light:hover:text-bg-dark">Mark all read</span>
                </div>
                <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
                  {notifications.map(item => (
                    <div
                      key={item.id}
                      className={cn(
                        "p-2.5 rounded-xl text-left border flex flex-col gap-1 transition-colors",
                        item.read
                          ? "bg-transparent border-transparent"
                          : "bg-white/5 border-white/5 light:bg-black/5 light:border-black/5"
                      )}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold font-display text-white light:text-bg-dark">{item.title}</span>
                        {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />}
                      </div>
                      <span className="text-xs text-text-secondary-dark">{item.text}</span>
                      <span className="text-[10px] text-text-secondary-dark/60 mt-1">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown Trigger */}
          {user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 md:gap-2.5 p-1 px-2.5 border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 transition-all text-left focus:outline-none"
              >
                <img
                  src={user.avatar || defaultAvatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-primary/20 object-cover"
                />
                <div className="hidden md:flex flex-col">
                  <span className="text-xs font-bold leading-none text-white light:text-bg-dark">{user.name}</span>
                  <span className="text-[10px] font-semibold text-primary mt-0.5 tracking-wider uppercase leading-none">
                    {user.role === "admin" ? "Admin" : `${user.totalPoints} Points`}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-text-secondary-dark" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 glass-panel border border-white/10 dark:border-white/10 light:border-black/10 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-1 z-50 text-white light:text-bg-dark">
                  
                  {/* Stats snippet (User only) */}
                  {user.role !== "admin" && (
                    <div className="p-3 bg-white/5 dark:bg-white/5 light:bg-black/5 rounded-xl flex items-center justify-between gap-2 border border-white/5 mb-1.5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-secondary-dark uppercase font-bold tracking-wider leading-none">Prediction Score</span>
                        <span className="text-sm font-extrabold text-white light:text-bg-dark mt-1 leading-none">{user.totalPoints} pts</span>
                      </div>
                      <Award className="w-5 h-5 text-accent animate-bounce" />
                    </div>
                  )}

                  {/* Navigation links based on role */}
                  {user.role === "admin" && (
                    <>
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-text-secondary-dark hover:text-white dark:hover:text-white light:hover:text-bg-dark hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    </>
                  )}
                  
                  {/* <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-text-secondary-dark hover:text-white dark:hover:text-white light:hover:text-bg-dark hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </Link> */}

                  <Link
                    to="/predictions"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-text-secondary-dark hover:text-white dark:hover:text-white light:hover:text-bg-dark hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5 transition-colors"
                  >
                    <Award className="w-4 h-4" />
                    My Predictions
                  </Link>

                  <div className="h-px bg-white/10 dark:bg-white/10 light:bg-black/10 my-1" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;
