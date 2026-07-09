// archivo para la autenticacion
import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged, // Observador de estado de autenticación
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Importamos Firestore

// 1. Crear el contexto
export const AuthContext = createContext();

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

// 2. Crear el proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(); // Obtenemos la instancia de auth una sola vez
  const db = getFirestore(); // Inicializamos Firestore para validar el rol del usuario

  // Función para registrar un nuevo usuario

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Función para iniciar sesión
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Función para cerrar sesión

  const logout = () => {
    signOut(auth);
  };
  useEffect(() => {
    // onAuthStateChanged es el observador de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Si hay un usuario, buscamos su rol en Firestore.
        const userDocRef = doc(db, "usuarios", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().rol === "admin") {
          // Si el documento existe y tiene rol de admin, lo asignamos.
          setUser({ ...currentUser, rol: "admin" });
        } else {
          // Para cualquier otro caso, es un usuario regular.
          setUser({ ...currentUser, rol: "invitado" });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Limpiamos el observador al desmontar
    return () => unsubscribe();
  }, [auth, db]); // Agregamos 'auth' como dependencia

  // Crear el objeto 'value' con TODAS las funciones definidas

  const value = {
    user,
    loading, // Es buena práctica pasar el estado de carga también
    signup,
    login, // Ahora 'login' sí existe y se puede pasar
    logout,
  };

  // Retornar el Provider, asegurándonos de no renderizar hasta que cargue
  // Esto evita que los componentes hijos puedan acceder a 'user' cuando es null
  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  );
};
