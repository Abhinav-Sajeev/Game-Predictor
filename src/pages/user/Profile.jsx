import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Mail, ShieldAlert, Award, Calendar, CheckCircle, Eye, Moon, Sun, Camera } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { defaultAvatar } from "../../assets";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

// Mock list of custom soccer player avatars for players to pick
const avatarPresets = [
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", // Footballer shot
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
];

const Profile = () => {
  const { user, updateProfile, theme, toggleTheme, triggerToast } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || ""
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile({
        name: data.name,
        email: data.email,
        avatar: selectedAvatar || null
      });
      triggerToast("Profile updated successfully! 🏆", "success");
    } catch (err) {
      triggerToast(err.message || "Failed to update profile details", "error");
    } finally {
      setLoading(false);
    }
  };

  const statBadges = [
    { label: "Predict score", value: user?.totalPoints || 0, sub: "Total points score", icon: <Award className="w-5 h-5 text-primary" /> },
    // { label: "Accuracy", value: `${user?.accuracy || 0}%`, sub: "Outcome hit-rate", icon: <CheckCircle className="w-5 h-5 text-accent" /> },
    { label: "Fixtures", value: user?.predictionsCount || 0, sub: "Predictions submitted", icon: <Calendar className="w-5 h-5 text-secondary" /> }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 w-full text-left"
    >
      <div className="flex justify-between items-center border-b border-white/5 pb-4 select-none">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-secondary-dark uppercase font-bold tracking-widest leading-none">Settings controls</span>
          <h1 className="text-xl font-black font-display text-white light:text-bg-dark mt-1 flex items-center gap-2 uppercase tracking-wide">
            <User className="w-5.5 h-5.5 text-primary" />
            Profile Settings
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Card details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="bg-card-dark text-white border border-white/5 p-6">
            <div className="text-xs font-bold text-text-secondary-dark uppercase tracking-widest border-b border-white/5 pb-3.5 mb-6">
              Personal Credentials Details
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Profile Avatar selector presets */}
              <div className="flex flex-col gap-3 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary-dark font-display">
                  Select Custom Avatar Profile
                </span>
                <div className="flex items-center gap-4 flex-wrap">
                  <img
                    src={selectedAvatar || defaultAvatar}
                    alt="Active Avatar"
                    className="w-16 h-16 rounded-full border-2 border-primary object-cover"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAvatar("")}
                      className={`w-10 h-10 rounded-full border object-cover flex items-center justify-center text-xs bg-white/5 hover:bg-white/10 ${
                        selectedAvatar === "" ? "border-primary" : "border-white/10"
                      }`}
                    >
                      Reset
                    </button>
                    {avatarPresets.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`w-10 h-10 rounded-full overflow-hidden border transition-all ${
                          selectedAvatar === av ? "border-primary ring-2 ring-primary/20 scale-105" : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <img src={av} alt="Preset avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name */}
              <Input
                label="Display Name"
                placeholder="Name"
                startIcon={<User className="w-4.5 h-4.5" />}
                error={errors.name?.message}
                {...register("name", { required: "Name is required" })}
              />

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                placeholder="Email Address"
                startIcon={<Mail className="w-4.5 h-4.5" />}
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email"
                  }
                })}
              />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-fit py-2.5 px-6 mt-2 font-bold uppercase tracking-wider text-xs"
              >
                Save Changes
              </Button>
            </form>
          </Card>
        </div>

        {/* Right column: Stats and Settings Theme */}
        <div className="flex flex-col gap-6">
          {/* Quick stats panel */}
          {user?.role !== "admin" && (
            <Card className="bg-card-dark text-white border border-white/5 p-6 flex flex-col gap-4">
              <div className="text-xs font-bold text-text-secondary-dark uppercase tracking-widest border-b border-white/5 pb-3.5">
                Competitor stats
              </div>
              <div className="flex flex-col gap-4">
                {statBadges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 p-3 rounded-xl bg-white/2 border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      {badge.icon}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-black font-display text-white light:text-bg-dark leading-none">{badge.value}</span>
                      <span className="text-[10px] text-text-secondary-dark mt-1 font-semibold leading-none">{badge.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Preferences Theme */}
          <Card className="bg-card-dark text-white border border-white/5 p-6 flex flex-col gap-4">
            <div className="text-xs font-bold text-text-secondary-dark uppercase tracking-widest border-b border-white/5 pb-3.5">
              Display Preferences
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white light:text-bg-dark font-display">Interface Theme</span>
                <span className="text-[10px] text-text-secondary-dark font-medium mt-0.5">Toggle dark/light palettes</span>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 py-2 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-text-secondary-dark hover:text-white transition-colors focus:outline-none"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4 text-primary" />
                    Light Theme
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-secondary" />
                    Dark Theme
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
