import React, { useState } from "react";
import styles from "./TarjetaProducto.module.css";
import { Contador } from "../../Contador/Contador";
import { Link } from "react-router-dom";
import { useCarrito } from "../../../context/CartContext";
import Swal from "sweetalert2";

function TarjetaProducto({ producto, esDestacado }) {
  const [esFavorito, setEsFavorito] = useState(false);
  const [cantidad, setCantidad] = useState(0);

  const { agregarAlCarrito, agregarCantidadTotal } = useCarrito();

  const cantidadActualEnCarrito = agregarCantidadTotal(producto.id);
  const stockDisponible = producto?.stock ?? 0;

  const toggleFavorito = () => {
    setEsFavorito(!esFavorito);
  };

  const handleAgregarAlCarrito = () => {
    // Sin stock
    if (stockDisponible === 0) {
      Swal.fire({
        icon: "warning",
        title: "Producto sin stock",
        text: "Este producto no tiene stock disponible.",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // No seleccionó cantidad
    if (cantidad === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cantidad inválida",
        text: "Seleccioná una cantidad mayor a 0.",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Supera el stock
    if (cantidad > stockDisponible) {
      Swal.fire({
        icon: "warning",
        title: "Stock insuficiente",
        text: `Solo hay ${stockDisponible} unidades disponibles.`,
        confirmButtonText: "Aceptar",
      });
      return;
    }

    agregarAlCarrito(producto, cantidad);

    Swal.fire({
      icon: "success",
      title: "Producto agregado",
      text: `${producto.nombre} fue agregado al carrito.`,
      timer: 1500,
      showConfirmButton: false,
    });

    setCantidad(0);
  };

  return (
    <div className={styles.tarjeta}>
      {esDestacado && <span className={styles.oferta}>¡Oferta Especial!</span>}

      <button
        className={`${styles.botonFavorito} ${
          esFavorito ? styles.activo : ""
        }`}
        onClick={toggleFavorito}
        aria-label="Agregar a favoritos"
      >
        {esFavorito ? "⭐" : "☆"}
      </button>

      {producto?.imagen && producto.imagen.trim() !== "" ? (
        <img
          src={producto.imagen}
          alt={producto?.nombre}
          className={styles.imagen}
        />
      ) : (
        <div className={styles.contenedorSinImagen}>
          <span className={styles.iconoSinImagen}>🖼️</span>
          <p>Sin imagen disponible</p>
        </div>
      )}

      <div className={styles.info}>
        <h3>{producto?.nombre}</h3>

        <p className={styles.precio}>${producto?.precio}</p>

        <p className={styles.stock}>
          Stock disponible: {stockDisponible}
        </p>

        <Link
          to={`/productos/${producto?.id}`}
          className={styles.enlaceDetalle}
        >
          Ver detalle
        </Link>
      </div>

      <div className={styles.acciones}>
        <Contador
          cantidad={cantidad}
          onIncrementar={() =>
            setCantidad((prev) =>
              prev < stockDisponible ? prev + 1 : prev
            )
          }
          onDecrementar={() =>
            setCantidad((prev) =>
              prev > 0 ? prev - 1 : 0
            )
          }
        />

        <button
          className={styles.botonAgregar}
          onClick={handleAgregarAlCarrito}
        >
          {stockDisponible === 0
            ? "Sin stock"
            : "Agregar al carrito"}
        </button>
      </div>

      <h5 className={styles.cantidadEnCarrito}>
        Cantidad en carrito: {cantidadActualEnCarrito}
      </h5>
    </div>
  );
}

export default TarjetaProducto;