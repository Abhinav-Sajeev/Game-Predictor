import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getAdminUsers } from "../../api/userview";
import UserManagement from "../../components/admin/UserManagement";
import Input from "../../components/common/Input";

const AdminUsers = () => {
  const { triggerToast } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getAdminUsers();
      if (response && response.success) {
        // Normalise _id → id for component compatibility
        const mapped = response.data.map((u) => ({
          id: u._id || u.id,
          name: u.name,
          totalPoints: u.totalPoints ?? 0
        }));
        setUsers(mapped);
      } else {
        triggerToast("Unexpected response from users API", "error");
      }
    } catch (err) {
      triggerToast("Failed to fetch user directory", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter by name only (no email in API response)
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 w-full text-left"
    >
      <div className="flex justify-between items-center border-b border-white/5 pb-4 select-none">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-secondary-dark uppercase font-bold tracking-widest leading-none">Administration</span>
          <h1 className="text-xl font-black font-display text-white light:text-bg-dark mt-1 flex items-center gap-2 uppercase tracking-wide">
            <Users className="w-5.5 h-5.5 text-primary" />
            User Accounts
          </h1>
        </div>
      </div>

      {/* User listing panel wrapper */}
      <div className="glass-panel border border-white/5 rounded-2xl p-6 shadow-xl bg-card-dark text-white flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-4">
          <h3 className="text-sm font-black font-display text-white light:text-bg-dark uppercase tracking-wider select-none">
            Registered Players ({filteredUsers.length})
          </h3>

          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            containerClassName="max-w-xs"
            className="py-2.5 pl-11 text-xs"
            startIcon={<Search className="w-4.5 h-4.5 text-text-secondary-dark" />}
          />
        </div>

        <UserManagement
          users={filteredUsers}
          loading={loading}
        />
      </div>
    </motion.div>
  );
};

export default AdminUsers;
