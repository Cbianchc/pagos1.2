import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../data/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle } from '../../data/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userRef = doc(db, 'users', authUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({ ...authUser, ...userSnap.data() });
        } else {
          await setDoc(userRef, {
            email: authUser.email,
            username: authUser.displayName,
            offices: [],
          });
          setUser(authUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función para iniciar sesión con Google
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({ ...user, ...userSnap.data() });
        } else {
          await setDoc(userRef, {
            email: user.email,
            username: user.displayName,
            offices: [],
          });
          setUser(user);
        }
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    } finally {
      setLoading(false);
    }
  };


	return (
    <AuthContext.Provider value={{ user, setUser, loading, handleGoogleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
