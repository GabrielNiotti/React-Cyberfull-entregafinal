// importamos el hook useState para manejar el estado del contador
//import { useState } from "react";
import styles from "./Contador.module.css";

// 1. Recibimos los datos y funciones desde TarjetaProducto
export function Contador({ cantidad, onIncrementar, onDecrementar }) {
    return (
        <div className={styles.contador}>
            {/* 2. Conectamos los botones a las funciones heredadas */}
            <button className={styles.boton} onClick={onDecrementar}>-</button>
            
            {/* 3. Mostramos la variable 'cantidad' que viene del padre */}
            <span className={styles.numero}>Cantidad: {cantidad}</span>
            
            <button className={styles.boton} onClick={onIncrementar}>+</button>
        </div>
    );
};


