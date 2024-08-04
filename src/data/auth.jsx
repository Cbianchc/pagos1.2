// auth.js (o donde manejes la autenticación)
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../data/firebase";

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Usuario autenticado:", user);

  } catch (error) {
    console.error("Error durante la autenticación con Google:", error);
  }
};

export { signInWithGoogle };
