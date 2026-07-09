import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductoDetalle.module.css";
// 🌟 Cambiamos los métodos de Firebase para buscar por campo interno
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { db } from "../../firebase/config";

const ProductoDetalle = () => {
  const { id } = useParams(); 
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;
    setCargando(true);

    const cargarProductoFirebase = async () => {
      try {
        // 1. Apuntamos a la colección completa de productos
        const productosRef = collection(db, "productos");
        
        // 2. Buscamos el documento donde el CAMPO "id" sea igual al de la URL
        // Evaluamos tanto en String como en Number para evitar errores de tipo de dato
        
        const q = query(
          productosRef, 
          where("id", "in", [String(id), Number(id)])
        );
        
        const querySnapshot = await getDocs(q);

        // Si la consulta no arrojó resultados
        if (querySnapshot.empty) {
          console.log("No se encontró ningún producto con el campo id:", id);
          setProducto(null);
          return;
        }

        // 3. Tomamos el primer producto que coincida (debería ser único)
        
        const docSnapshot = querySnapshot.docs[0];
        const dataProducto = docSnapshot.data();

        setProducto({
          ...dataProducto,
          idFirestore: docSnapshot.id, // ID autogenerado de Firebase por si lo usas
        });

      } catch (error) {
        console.error("Error al cargar el detalle desde Firestore:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarProductoFirebase();
  }, [id]);

  if (cargando) {
    return <h2 className={styles.mensajeCarga}>Cargando detalle del producto...</h2>;
  }
  
  if (!producto) {
    return <h2 className={styles.mensajeError}>El producto solicitado no existe.</h2>;
  }

  return (
    <div className={styles.contenedorDetalle}>
      <h2>Información del Producto</h2>

      <div className={styles.tarjetaDetalle}>
        {producto.imagen && (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className={styles.imagen}
          />
        )}
        <h3>{producto.nombre}</h3>
        <p className={styles.categoria}>Categoría: {producto.categoria}</p>
        <p className={styles.descripcion}>
          Descripción: {producto.descripcion}
        </p>
        <p className={styles.precio}>Precio: ${producto.precio}</p>
        <p className={styles.stock}>Stock disponible: {producto.stock}</p>
      </div>
    </div>
  );
};

export default ProductoDetalle;
