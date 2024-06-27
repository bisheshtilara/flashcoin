import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = React.createContext<User | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userData) => {
      setUser(userData);
      if (location.pathname.includes("/auth") && userData) {
        navigate("/dashboard/charts", { replace: true });
      } else if (location.pathname.includes("/anonymous") && userData) {
        navigate("/dashboard/charts", { replace: true });
      } else if (
        (location.pathname.includes("/dashboard") ||
          location.pathname.includes("/admin")) &&
        !userData
      ) {
        navigate("/anonymous/charts", { replace: true });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const user = React.useContext(AuthContext);
  const [userData, setUserData] = React.useState<any>(null);
  const navigate = useNavigate();

  const provider = new GoogleAuthProvider();
  const [loading, setLoading] = React.useState<boolean>(true);
  const signin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      toast.error("Invalid email or password");
    }
  };

  const signinWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        localStorage.setItem("firstLogin", JSON.stringify(true));
        localStorage.setItem("firstNews", JSON.stringify(true));
        localStorage.setItem("firstLists", JSON.stringify(true));
        await setDoc(doc(db, "users", user.uid), {
          firstName: user.displayName?.split(" ")[0],
          lastName: user.displayName?.split(" ")[1],
          email: user.email,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      localStorage.setItem("firstLogin", JSON.stringify(true));
      localStorage.setItem("firstNews", JSON.stringify(true));
      localStorage.setItem("firstLists", JSON.stringify(true));
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName,
        lastName,
        email,
      });
    } catch (e) {
      console.error("Error creating user", e);
    }
  };

  const signout = async () => {
    await signOut(auth);
  };

  React.useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      setUserData({ ...doc.data(), id: doc.id });
      setLoading(false);
      if (
        doc.data() &&
        doc.data()?.admin &&
        !location.pathname.includes("/admin")
      ) {
        navigate("/admin/editCharts");
      }
    });
    return unsub;
  }, []);

  const updateUserInfo = async (data: any) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), data);
  };

  const resetPassword = async () => {
    await sendPasswordResetEmail(auth, userData.email);
    setTimeout(async () => {
      await signout();
    }, 2000);
  };

  return {
    userId: user?.uid,
    user,
    signin,
    signout,
    signup,
    signinWithGoogle,
    userData,
    updateUserInfo,
    resetPassword,
    loading,
  };
};
