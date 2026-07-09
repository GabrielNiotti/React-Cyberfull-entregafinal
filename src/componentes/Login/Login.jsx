import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css"; // 🚀 Importamos los estilos modulares

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredencial) => {
        const user = userCredencial.user;
        console.log("El usuario ha sido identificado:", user);
        alert("¡Inicio de sesión exitosa!");
        navigate("/"); 
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error en el login:", errorCode, errorMessage);
        alert(`Error: ${errorMessage}`);
      });
  };

  return (
    // ✨ Contenedor principal que centra todo vertical y horizontalmente
    <div className={styles.loginPagina}>
      <div className={styles.loginTarjeta}>
        <h2 className={styles.titulo}>Iniciar Sesión</h2>
        
        <form onSubmit={handleLogin} className={styles.formulario}>
          <div className={styles.campoGrupo}>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.campoGrupo}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          
          <button type="submit" className={styles.btnIngresar}>
            Ingresar
          </button>
        </form>
        
        <p className={styles.textoRegistro}>
          ¿No tenés una cuenta? <Link to="/registro" className={styles.enlace}>Registrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
