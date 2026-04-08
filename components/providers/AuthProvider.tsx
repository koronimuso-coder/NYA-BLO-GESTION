"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface UserData {
  role?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  lastLogin?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- WOW MOCK AUTH FILL ---
    const hasFirebase = !!auth && Object.keys(auth).length > 0 && "app" in auth;

    if (!hasFirebase) {
      console.warn("🔐 Auth: Mode Démonstration activé.");
      // We use a microtask to avoid the synchronous setState warning
      Promise.resolve().then(() => {
        setUser({
          uid: "mock-user-id",
          email: "dirigeant@nya-blo.os",
          displayName: "Chef d'Entreprise NYA BLO",
        } as FirebaseUser);
        setUserData({
          role: "ADMIN",
          lastLogin: new Date().toISOString(),
        });
        setLoading(false);
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch extended profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("❌ Error fetching user profile:", error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
