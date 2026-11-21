import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AdminProfile {
  full_name: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: AdminProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
        // Defer the profile query until after the auth callback.
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

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setUser(null);
    setProfile(null);
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