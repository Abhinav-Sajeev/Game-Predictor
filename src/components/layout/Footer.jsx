import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-white/5 dark:border-white/5 light:border-black/5 text-center flex flex-col sm:flex-row sm:justify-between items-center px-4 md:px-8 text-xs text-text-secondary-dark gap-2 font-medium">
      <div>
        &copy; {new Date().getFullYear()} FIFA Predictor. All rights reserved.
      </div>
      <div className="flex items-center gap-4">
        <span className="hover:text-primary transition-colors cursor-pointer">Terms & Conditions</span>
        <span className="hover:text-primary transition-colors cursor-pointer">Fantasy Rules</span>
        <span className="hover:text-primary transition-colors cursor-pointer">Support</span>
      </div>
    </footer>
  );
};

export default Footer;
