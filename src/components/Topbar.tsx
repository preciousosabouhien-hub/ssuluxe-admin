import {
Bell,
ChevronRight,
Menu,
Search,
LogOut,
} from "lucide-react";

import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";

export default function Topbar({
onMenuClick,
}: {
onMenuClick: () => void;
}) {
const {
activePage,
searchQuery,
setSearchQuery,
showNotice,
} = useDashboard();

const { user, profile, signOut } = useAuth();

const adminName =
profile?.full_name ||
user?.email?.split("@")[0] ||
"Administrator";

const initials = adminName
.split(" ")
.filter(Boolean)
.map((part) => part[0])
.join("")
.slice(0, 2)
.toUpperCase();

async function handleLogout() {
try {
await signOut();
} catch (error) {
console.error("Logout failed:", error);
showNotice("Unable to log out. Please try again.");
}
}

return (
    <header className="topbar">
  <div className="breadcrumbs">
    <span>Workspace</span>
    <ChevronRight size={14} />
    <strong>{activePage}</strong>
  </div>
  <div className="top-actions">
    <label className="top-search">
      <Search size={16} />
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search orders..."
      />
      <kbd>⌘ K</kbd>
    </label>
    <button
      className="icon-button notification-button"
      aria-label="Notifications"
      onClick={() => showNotice("You're all caught up")}
    >
      <Bell size={18} />
      <i />
    </button>
    <div className="profile">
      <div className="avatar avatar-purple">
        {initials}
      </div>
      <div className="profile-copy">
        <strong>{adminName}</strong>
        <small>Administrator</small>
      </div>
    </div>
    <button
      className="logout-button"
      onClick={handleLogout}
      title="Log out"
      aria-label="Log out"
    >
      <LogOut size={17} />
      <span>Logout</span>
    </button>
  </div>
</header>

);
}