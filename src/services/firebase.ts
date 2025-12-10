import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

// Configuración oficial de Firebase (credenciales reales)
const firebaseConfig = {
  apiKey: "AIzaSyBrDyjHHE8Fut5xJWnxexj6rtax-Jsvdqs",
  authDomain: "pizza-brava-dev.firebaseapp.com",
  projectId: "pizza-brava-dev",
  storageBucket: "pizza-brava-dev.firebasestorage.app",
  messagingSenderId: "118092051274",
  appId: "1:118092051274:web:17c2c7bc778079ca3a87b3",
  measurementId: "G-2RYZ83SFSY"
};

// Inicializar Firebase solo una vez (manejo de Vite + HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Analytics (solo en producción y navegador)
if (typeof window !== "undefined" && location.hostname !== "localhost") {
  getAnalytics(app);
}

// Emuladores solo en localhost
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  // Evita error de "ya conectado" con HMR
  // @ts-ignore
  if (!db._settingsFrozen) {
    console.log("🔧 Conectando a Emuladores Firebase...");

    try {
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
      connectAuthEmulator(auth, "http://127.0.0.1:9099");
      connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    } catch (e) {
      console.warn("Emuladores ya conectados o error al conectar.");
    }
  }
}

export default app;
