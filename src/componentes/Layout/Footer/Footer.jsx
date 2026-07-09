import Directorio from "../../Equipo/Directorio";
import styles from "./Footer.module.css";

function Footer() {
    const anioActual = new Date().getFullYear();
    return (
        <footer className={styles.footer}>
            <div className={styles['contenedor-footer']}>
                <h3 className="mb-3"> Nuestro equipo</h3>
                <div className={styles.equipoGrid}>
                <Directorio />
                </div>
                <hr/>

                <p className="text-center">&copy; {anioActual} CyberFull Derechos Reservados</p>

            </div>
        </footer>
    );
    
}

export default Footer;