import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Calendar, History, Trophy, User, ShieldAlert, Users, PlusCircle, PenTool, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../utils/helpers";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const userLinks = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Matches", path: "/matches", icon: <Calendar className="w-5 h-5" /> },
    { name: "My Predictions", path: "/predictions", icon: <History className="w-5 h-5" /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <Trophy className="w-5 h-5" /> },
    // { name: "Profile Settings", path: "/profile", icon: <User className="w-5 h-5" /> }
  ];

  const adminLinks = [
    { name: "Admin Dashboard", path: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Matches Panel", path: "/admin/matches", icon: <Calendar className="w-5 h-5" /> },
    { name: "Publish Results", path: "/admin/results", icon: <PenTool className="w-5 h-5" /> },
    { name: "Create Fixture", path: "/admin/create-match", icon: <PlusCircle className="w-5 h-5" /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <Trophy className="w-5 h-5" /> },
    { name: "User Accounts", path: "/admin/users", icon: <Users className="w-5 h-5" /> }
  ];

  const renderLinks = (links, title) => (
    <div className="flex flex-col gap-1">
      {title && (
        <span className="text-[10px] font-bold text-text-secondary-dark/60 uppercase tracking-widest px-3 mb-2 font-display">
          {title}
        </span>
      )}
      {links.map(link => {
        // Strict active check
        const isActive = location.pathname === link.path;
        return (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all border border-transparent select-none",
              isActive
                ? "bg-primary/10 dark:bg-primary/10 light:bg-primary/5 border-primary/20 text-primary dark:text-primary font-bold shadow-[inset_0_0_8px_rgba(0,200,150,0.05)]"
                : "text-text-secondary-dark hover:text-white dark:hover:text-white light:hover:text-bg-dark hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
            )}
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        );
      })}
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card-dark/45 dark:bg-card-dark/45 light:bg-card-light backdrop-blur-xl border-r border-white/10 dark:border-white/10 light:border-black/5 w-64 p-5 pt-28 text-white light:text-bg-dark shadow-xl">
      {/* Mobile Header trigger */}
      <div className="flex md:hidden items-center justify-between mb-6 border-b border-white/5 pb-4">
        <span className="font-extrabold uppercase font-display text-sm text-primary tracking-widest">Navigation</span>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/5 rounded-lg text-text-secondary-dark hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto pr-1">
        {/* Show user nav only for non-admins */}
        {user?.role !== "admin" && renderLinks(userLinks, "Portal Navigation")}

        {/* Admin Navigation Links */}
        {user?.role === "admin" && renderLinks(adminLinks, "Admin Operations")}
      </div>

      {/* Sidebar Footer */}
      <div className="mt-auto pt-6 border-t border-white/5 dark:border-white/5 light:border-black/5 flex flex-col items-center justify-center text-center gap-1.5">
        <span className="text-[10px] text-text-secondary-dark font-medium leading-none">FIFA Match Prediction App</span>
        <span className="text-[9px] text-text-secondary-dark/50 leading-none">v1.0.0 (API Ready)</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Static */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 z-30 w-64 pt-20">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute left-0 top-0 bottom-0 w-64 h-full"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
