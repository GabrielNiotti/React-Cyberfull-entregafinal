import React, { useEffect, useState } from "react";
//importamos claves de firebase
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import { db } from "../../../firebase/config";

const ProductosDb = () => {
  const [productos, setProductos] = useState([]);
  useEffect(() => {
    //datos de conexion con la base de datos
    const prodDB = collection(db, "productos");

    getDocs(prodDB).then((resp) => {
      setProductos(
        resp.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        }),
      );
    });
  }, []); // el array vacio asegura que este efecto se ejecuto solo una vez

  return (
    <div>
      <h2>Productos Db</h2>
      <div className="lista-productos">
        
        {/* 5. Mapeamos el estado `productos` para renderizar cada uno */}
        {productos.map((prod) => (
          <div key={prod.id}>
            
            <img
              src={prod.imagen}
              alt={prod.nombre}
              style={{ width: "100px" }}
            />
            <h3>{prod.nombre}</h3> <p>Categoría: {prod.categoria}</p>
            <p>Precio: ${prod.precio}</p> <p>Stock: {prod.stock} unidades</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductosDb;
