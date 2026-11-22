import {
createContext,
useContext,
useEffect,
useState,
useCallback,
} from "react";

import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AdminProfile {
full_name: string | null;
role: string;
}

interface AuthContextType {
user: User | null;
profile: AdminProfile | null;
loading: boolean;
signIn: (email: string, password: string) => Promise;
signOut: () => Promise;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Automatically log out after 15 minutes of inactivity.
const INACTIVITY_LIMIT = 15 * 60 * 1000;

export function AuthProvider({
children,
}: {
children: ReactNode;
}) {
const [user, setUser] = useState<User | null>(null);
const [profile, setProfile] = useState<AdminProfile | null>(null);
const [loading, setLoading] = useState(true);

async function loadAdminProfile(currentUser: User) {
const { data, error } = await supabase
.from("profiles")
.select("full_name, role")
.eq("id", currentUser.id)
.maybeSingle();

if (error) {
  console.error("Profile verification failed:", error);
  setProfile(null);
  return false;
}
if (!data || data.role !== "admin") {
  setProfile(null);
  return false;
}
setProfile(data);
return true;

}

const signOut = useCallback(async () => {
const { error } = await supabase.auth.signOut();

if (error) throw error;
setUser(null);
setProfile(null);

}, []);

// Initialize authentication.
useEffect(() => {
let mounted = true;

async function initializeAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (mounted && session?.user) {
    setUser(session.user);
    await loadAdminProfile(session.user);
  }
  if (mounted) setLoading(false);
}
initializeAuth();
const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((_event, session) => {
  if (!mounted) return;
  setUser(session?.user ?? null);
  if (!session?.user) {
    setProfile(null);
    setLoading(false);
  } else {
    setTimeout(() => {
      if (mounted) {
        loadAdminProfile(session.user);
      }
    }, 0);
  }
});
return () => {
  mounted = false;
  subscription.unsubscribe();
};

}, []);

// Automatically sign out after 15 minutes without activity.
useEffect(() => {
if (!user || profile?.role !== "admin") return;

let inactivityTimer: ReturnType<typeof setTimeout>;
const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(async () => {
    try {
      await signOut();
      console.info("Admin signed out due to inactivity.");
    } catch (error) {
      console.error("Automatic logout failed:", error);
    }
  }, INACTIVITY_LIMIT);
};
const activityEvents = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];
activityEvents.forEach((event) => {
  window.addEventListener(event, resetInactivityTimer, {
    passive: true,
  });
});
resetInactivityTimer();
return () => {
  clearTimeout(inactivityTimer);
  activityEvents.forEach((event) => {
    window.removeEventListener(event, resetInactivityTimer);
  });
};

}, [user, profile, signOut]);

async function signIn(email: string, password: string) {
const { data, error } = await supabase.auth.signInWithPassword({
email,
password,
});

if (error) throw error;
if (!data.user) {
  throw new Error("Unable to verify your account.");
}
const isAdmin = await loadAdminProfile(data.user);
if (!isAdmin) {
  await supabase.auth.signOut();
  throw new Error("Access denied. This account is not an administrator.");
}

}

return (
<AuthContext.Provider
value={{
user,
profile,
loading,
signIn,
signOut,
}}
>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
const context = useContext(AuthContext);

if (!context) {
throw new Error("useAuth must be used inside AuthProvider");
}

return context;
}