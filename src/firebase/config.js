// Importa las funciones que necesitas de los SDKs de Firebase
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Importa Firestore para la base de datos

// TODO: Agregar SDKs de Firebase que necesites
// https://firebase.google.com/docs/web/setup#available-libraries

// configuración de Firebase de tu proyecto, obtenida desde la consola de Firebase
// para conectar tu aplicación con tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBLlAYAM5u1ST-JwYFaYMIeSheXUMzW_hE",
  authDomain: "proyecto-ciberfull.firebaseapp.com",
  projectId: "proyecto-ciberfull",
  storageBucket: "proyecto-ciberfull.firebasestorage.app",
  messagingSenderId: "522900838851",
  appId: "1:522900838851:web:545542caa8af2354a0c576",
  measurementId: "G-D234ZLN4ND"
};

// Inicializa Firebase con la configuración proporcionada y obtiene una instancia de Analytics para el proyecto. Esto permite que tu aplicación se conecte a Firebase y utilice sus servicios, como autenticación, base de datos, almacenamiento, etc., según lo que hayas configurado en tu proyecto de Firebase.
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app); // Exporta la instancia de Firestore para usarla en otros archivos de tu proyecto, permitiéndote interactuar con la base de datos de Firebase desde cualquier parte de tu aplicación.
