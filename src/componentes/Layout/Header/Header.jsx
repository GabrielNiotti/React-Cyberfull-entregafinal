import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "./Header.module.css";
import logo from "../../../../public/images/logoCyberFull.jpeg";
import { Link } from "react-router-dom";
import Carrito from "../../Carrito/Carrito";
import { useCarrito } from "../../../context/CartContext";
import GestionCupones from "../../GestionCupones/GestionCupones";
import { useAuth } from "../../../context/AuthContext";
import Login from "../../Login/Login";
import { AuthProvider } from "../../../context/AuthContext";
import { getAuth } from "firebase/auth";


function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  //agregamos los datos de autenticacion para poder mostrar el boton de login o logout dependiendo del estado del usuario
  const { user, logout } = useAuth();

  const { agregarCantidad } = useCarrito();
  const cantidadTotal = agregarCantidad();

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };
  return (
    <div className={styles.contenedorHeader}>
      <img src={logo} alt="Logo de Cyberfull" className={styles.logo} />
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <h1 className={styles.titulo}> CyberFull</h1>
        <h2 className={styles.subtitulo}>Soluciones en Tecnología</h2>
        <br></br>
      </div>
      <button
        className={styles.menuIcon}
        onClick={toggleMenu}
        aria-label="Menú"
      >
        {menuAbierto ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`${styles.menu} ${menuAbierto ? styles.menuActivo : ""}`}>
  {/* Bloque 1: Los enlaces de navegación principales */}
  <ul className={styles["lista-grid"]}>
    <li><Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link></li>
    <li><Link to="/productos" onClick={() => setMenuAbierto(false)}>Productos</Link></li>
    <li><Link to="/servicios" onClick={() => setMenuAbierto(false)}>Servicios</Link></li>
     <li>
  <Link
    to="/carrito"
    onClick={() => setMenuAbierto(false)}
    style={{ color: "black" }}
  >
    Carrito ({cantidadTotal})
  </Link>
</li>
    
    {user && user.rol === "admin" && (
      <>
        <li>
          <Link to="/gestion" onClick={() => setMenuAbierto(false)} style={{ color: "black" }}>
            Gestión de Productos
          </Link>
        </li>
        <li>
          <Link to="/cupones" onClick={() => setMenuAbierto(false)}>
            Cupones
          </Link>
        </li>
      </>
      
    )}
    

    {!user && (
      <li>
        <Link to="/login" onClick={() => setMenuAbierto(false)}>Login</Link>
      </li>
    )}

   
  </ul>

  {/* Bloque 2: ✨ NUEVO CONTENEDOR DE USUARIO (Debajo de la lista) */}
  {user && (
  <div className={styles.usuarioContenedor}>
    <div className={styles.usuarioBloque}>
      <span className={styles.saludo}>
        ¡Hola, {user.email}! Bienvenido a la tienda. Tu rol es: {user.rol}
      </span>
      <button onClick={logout} className={styles.btnCerrarSesion}>
        Cerrar Sesión
      </button>
    </div>
  </div>
)}

</nav>

    </div>
  );
}
export default Header;
