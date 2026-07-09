import React from "react";
import Productos from "../Productos/Productos";
import styles from "./Inicio.module.css";

function Inicio() {
  return (
    <div className={styles.contenedorInicio}>
      <h1>Te damos la bienvenida a nuestra tienda</h1>
      <h4>Aqui encontraras variedad de elemetos en tecnologia</h4>
      
      
      <Productos Mensaje="Ofertas destacadas" Destacados={true} />
    </div>
  );
}

export default Inicio;
