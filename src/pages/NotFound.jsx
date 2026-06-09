import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Home } from "lucide-react";
import { football } from "../assets";
import Button from "../components/common/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6 text-center text-white select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center max-w-md gap-4"
      >
        <div className="relative w-28 h-28 mb-4">
          {/* Soccer ball image rotating */}
          <motion.img
            src={football}
            alt="Soccer Ball"
            className="w-full h-full object-contain filter drop-shadow-lg"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          />
          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center border border-bg-dark">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-black font-display uppercase tracking-widest text-primary leading-none">
          Offside!
        </h1>
        
        <h2 className="text-lg font-bold font-display uppercase tracking-wider text-white">
          Page Not Found (404 Error)
        </h2>
        
        <p className="text-xs text-text-secondary-dark leading-relaxed font-semibold">
          You have drifted past the defensive line! The page you are looking for has been caught in an offside trap or doesn't exist.
        </p>

        <Link to="/" className="mt-4">
          <Button
            variant="primary"
            size="md"
            className="font-bold uppercase tracking-wider text-xs"
            startIcon={<Home className="w-4 h-4" />}
          >
            Back to Match Center
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
