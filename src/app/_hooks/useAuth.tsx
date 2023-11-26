"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { auth, db } from "../_lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export interface User {
  uid: string;
  name: string;
  email: string;
}

type Response = Promise<void | { error?: { message: string } }>;

interface AuthContext {
  user: User;
  loading?: boolean;
  signUp: (credentials: {
    name: string;
    email: string;
    password: string;
  }) => Response;
  signIn: (credentials: { email: string; password: string }) => Promise<any>;
  signOut: () => Response;
  setLoading: (loading: boolean) => void;
}

const authContext = createContext({ user: {} } as AuthContext);
const { Provider } = authContext;

export function AuthProvider(props: { children: ReactNode }): JSX.Element {
  const auth = useAuthProvider();
  return <Provider value={auth as any}>{props.children}</Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

const useAuthProvider = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const createUser = async (currentUser: User) => {
    try {
      return db
        .collection("users")
        .doc(currentUser.uid)
        .set({ ...currentUser }, { merge: true });
    } catch (error) {
      return { error };
    }
  };

  const signUp = async ({ name, email, password }: any) => {
    setLoading(true);
    try {
      return await createUserWithEmailAndPassword(auth, email, password).then(
        (response: any) => {
          return createUser({
            uid: response.user.uid,
            email: email.toLowerCase(),
            name,
          });
        }
      );
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  const signIn = async ({ email, password }: any) => {
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = { ...user };
      setUser(currentUser as any);
      setLoading(false);
      return currentUser;
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      setLoading(false);
      return setUser(null);
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  const handleAuthStateChanged = (user: any) => {
    if (user?.uid) {
      setUser(user as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged as any);

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.uid) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => setUser({ ...user, ...doc.data() }));
    }
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    setLoading,
  };
};
