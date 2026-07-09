import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Productos.module.css";
import TarjetaProducto from "../Layout/TarjetaProducto/TarjetaProducto";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

function Productos({ Mensaje, Destacados }) {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null); //
  const [cargando, setCargando] = useState(true);
  //efecto useEffect para cargar los productos desde un archivo JSON al montar el componente
  /*useEffect(() => {
    fetch("/data/productos.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudo cargar la informacion de los productos");
        }
        return respuesta.json();
      })
      .then((datos) => {
        setProductos(datos);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);*/ // 👈 se ejecuta solo una vez al montar el componente

  useEffect(() => {
  const prodDB = collection(db, "productos");

  getDocs(prodDB)
    .then((resp) => {
      setProductos(
        resp.docs.map((doc) => ({
          firestoreId: doc.id, // ID del documento en Firestore
          ...doc.data(),       // id = ID manual del producto
        }))
      );

      setCargando(false);
    })
    .catch((err) => {
      setError(err.message);
      setCargando(false);
    });

}, []);;// el array vacio asegura que este efecto se ejecuto solo una vez

  //renderizo spinner

  //renderice condicionalmente según el estado de carga, error o datos
  if (cargando) {
    return (
      <div className={styles.contenedorCarga}>
        <div className={styles.spinner}></div>
        <p className={styles.textoCarga}>
          Cargando productos, por favor espere...
        </p>
      </div>
    );
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  const productosOferta = Destacados
    ? productos.filter((prod) => prod.destacado === true)
    : productos;

  //cuando se renderiza el componente, se muestra el mensaje y la lista de productos
  return (
    <div className={styles.contenedorProductos}>
      <h1>{Mensaje}</h1>

      <div className={styles.grilla}>
        {productosOferta.map((item) =>  (
          
          <div key={item.id} className={styles.contenedorTarjeta}>
            <TarjetaProducto producto={item} esDestacado={Destacados} />
            {/*<Link to={`/productos/${item.idFirestore || item.id}`} className={styles.linkDetalle}>
              Ver Detalle
            </Link> (esto me genera un boton)*/}
          </div>
        ))}
      </div>
    </div>
  );
}
export default Productos;
