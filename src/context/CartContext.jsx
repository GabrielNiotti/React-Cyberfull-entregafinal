import { useState, createContext, useContext } from "react";
import { db } from "../firebase/config"; // Verifica que esta ruta a tu Firebase config sea correcta
import { collection, query, where, getDocs } from "firebase/firestore";

export const CartContext = createContext();

export const useCarrito = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCarrito debe ser utilizado dentro de un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [cuponAplicado, setCuponAplicado] = useState(null); // Estado para el cupón activo de Firebase

  const agregarAlCarrito = (producto, cantidad) => {
    const productoExistente = carrito.find(
      (item) => String(item.id) === String(producto.id),
    );
    if (productoExistente) {
      const nuevoCarrito = carrito.map((item) =>
        String(item.id) === String(producto.id)
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item,
      );
      setCarrito(nuevoCarrito);
    } else {
      setCarrito((prevCarrito) => [...prevCarrito, { ...producto, cantidad }]);
    }
  };

  const eliminarCarrito = () => {
    setCarrito([]);
    setCuponAplicado(null); // Limpia el cupón al vaciar el carro
  };

  const agregarCantidad = () => {
    return carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
  };

  // Calcula el subtotal bruto y descuenta según las reglas del cupón traído de Firebase
    // 🌟 MODIFICADO: Ahora calcula el descuento basándose en el porcentaje de tu base de datos
  const precioTotal = () => {
    const subtotalBruto = carrito.reduce(
      (acumulador, item) => acumulador + item.cantidad * item.precio,
      0,
    );

    if (!cuponAplicado) return subtotalBruto;

    // Calculamos el descuento usando la propiedad 'porcentaje'
    const descuento = (subtotalBruto * cuponAplicado.porcentaje) / 100;
    return Math.max(0, subtotalBruto - descuento); // Evita totales negativos
  };

  // 🌟 MODIFICADO: Extrae el campo "porcentaje" directamente de Firebase
  const aplicarCupon = async (codigo) => {
    const codigoLimpio = codigo.trim().toUpperCase();

    try {
      const cuponesRef = collection(db, "cupones");
      const q = query(cuponesRef, where("codigo", "==", codigoLimpio));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, mensaje: "El cupón ingresado no es válido o ya venció." };
      }

      // Accedemos al primer documento encontrado con [0]
      const primerDoc = querySnapshot.docs[0];
      const datosCuponFirebase = primerDoc.data();

      // Guardamos la estructura real: codigo y porcentaje
      setCuponAplicado({
        codigo: codigoLimpio,
        porcentaje: Number(datosCuponFirebase.porcentaje) // 👈 Lee tu campo integer de Firebase
      });

      return { success: true, mensaje: "¡Cupón de descuento aplicado!" };

    } catch (error) {
      console.error("Error al consultar el cupón en Firebase:", error);
      return { success: false, mensaje: "Error de conexión con la base de datos." };
    }
  };


  const removerCupon = () => {
    setCuponAplicado(null);
  };

  const agregarCantidadTotal = (productoId) => {
    const producto = carrito.find(
      (item) => String(item.id) === String(productoId),
    );
    return producto ? producto.cantidad : 0;
  };

  const removerDelCarrito = (productoId) => {
    const nuevoCarrito = carrito.filter(
      (item) => String(item.id) !== String(productoId),
    );
    setCarrito(nuevoCarrito);
  };

  const verificarProductoEnCarrito = (productoId) => {
    return carrito.some((item) => String(item.id) === String(productoId));
  };

  const restarCantidad = (productoId) => {
    const productoExistente = carrito.find(
      (item) => String(item.id) === String(productoId),
    );
    
    if (productoExistente) {
      if (productoExistente.cantidad > 1) {
        const nuevoCarrito = carrito.map((item) =>
          String(item.id) === String(productoId)
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        );
        setCarrito(nuevoCarrito);
      } else {
        const nuevoCarrito = carrito.filter(item => String(item.id) !== String(productoId));
        setCarrito(nuevoCarrito);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        carrito,
        cuponAplicado,
        aplicarCupon,
        removerCupon,
        agregarAlCarrito,
        eliminarCarrito,
        agregarCantidad,
        agregarCantidadTotal,
        precioTotal,
        removerDelCarrito,
        verificarProductoEnCarrito,
        restarCantidad,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
