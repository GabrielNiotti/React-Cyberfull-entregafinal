import React, { useState } from "react";
import { useCarrito } from "../../context/CartContext"; 
import styles from "./Carrito.module.css";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

function Carrito() {
  const { 
    carrito, 
    eliminarCarrito, 
    precioTotal, 
    removerDelCarrito,
    cuponAplicado,
    aplicarCupon,
    removerCupon 
  } = useCarrito();

  const [seleccionados, setSeleccionados] = useState([]);
  const [textoCupon, setTextoCupon] = useState("");

  // 🌟 OPERACIONES MATEMÁTICAS PARA EL DESGLOSE VISUAL
  // 1. Calculamos el subtotal bruto (suma de precio * cantidad de cada item)
  const subtotalBruto = carrito.reduce((acc, item) => acc + item.cantidad * item.precio, 0);

  // 2. Si hay un cupón activo, calculamos cuántos pesos representa ese porcentaje
  const descuentoPesos = cuponAplicado 
    ? (subtotalBruto * cuponAplicado.porcentaje) / 100 
    : 0;

  const handleCheckboxChange = (id) => {
    if (seleccionados.includes(String(id))) {
      setSeleccionados(seleccionados.filter((item) => item !== String(id)));
    } else {
      setSeleccionados([...seleccionados, String(id)]);
    }
  };

  const eliminarSeleccionados = () => {
    seleccionados.forEach((id) => removerDelCarrito(id));
    setSeleccionados([]);
  };

  const handleManejarCupon = async (e) => {
    e.preventDefault();
    if (!textoCupon.trim()) return;
    const resultado = await aplicarCupon(textoCupon);
    alert(resultado.mensaje);
    if (resultado.success) setTextoCupon("");
  };

  if (carrito.length === 0) {
    return (
      <div className={styles.contenedorCarrito}>
        <h1>Carrito Vacío</h1>
        <p>Agrega los productos que deseas comprar.</p>
        <Link to="/productos" className={styles.botonVolver}>
          <button className={styles.botonVolver}>Volver a los productos</button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.contenedorCarrito}>
      <h1>Carrito de Compras</h1>

      {seleccionados.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          <button onClick={eliminarSeleccionados} className={styles.botonVaciar} style={{ backgroundColor: "#d9534f" }}>
            Eliminar productos seleccionados ({seleccionados.length})
          </button>
        </div>
      )}

      <div className={styles.listaProductos}>
        {carrito.map((item) => (
          <div key={item.id} className={styles.itemCarrito} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <input
              type="checkbox"
              checked={seleccionados.includes(String(item.id))}
              onChange={() => handleCheckboxChange(item.id)}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
            <div>
              <img src={item.imagen} alt={item.nombre} className={styles.imagenProducto} />
            </div>
            <div className={styles.detallesProducto}>
              <h4>{item.nombre}</h4>
              <p>Cantidad: {item.cantidad}</p>
              <p>Precio unitario: ${item.precio.toFixed(2)}</p>
              <p>Subtotal: ${(item.cantidad * item.precio).toFixed(2)}</p>
            </div>
            <button
              onClick={() => removerDelCarrito(item.id)}
              aria-label={`Eliminar ${item.nombre} del carrito`}
              title="Eliminar producto"
              style={{
                background: "none",
                border: "none",
                color: "#d9534f",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                transition: "background-color 0.2s, transform 0.1s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fce8e6"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <Trash2 size={22} />
            </button>
          </div>
        ))}
      </div>

      <hr />

      <div className={styles.resumenCompra}>
        {/* Caja de Cupones */}
        <div style={{ margin: "20px 0", textAlign: "left", padding: "10px", border: "1px dashed #ccc", borderRadius: "6px" }}>
          {!cuponAplicado ? (
            <form onSubmit={handleManejarCupon} style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="¿Tienes un cupón? Ej: MUNDIAL"
                value={textoCupon}
                onChange={(e) => setTextoCupon(e.target.value)}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", flex: 1 }}
              />
              <button type="submit" className={styles.botonCheckout} style={{ padding: "8px 15px", whiteSpace: "nowrap" }}>
                Aplicar Cupón
              </button>
            </form>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#e2f0d9", padding: "8px", borderRadius: "4px" }}>
              <span style={{ color: "#375623", fontWeight: "bold" }}>
                Cupón Activo: {cuponAplicado.codigo} (-{cuponAplicado.porcentaje}%)
              </span>
              <button onClick={removerCupon} style={{ backgroundColor: "#d9534f", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>
                Quitar
              </button>
            </div>
          )}
        </div>

        {/* 🌟 NUEVO: DESGLOSE DETALLADO DEL PRECIO */}
        <div style={{ textAlign: "right", marginBottom: "15px", fontSize: "16px", lineHeight: "1.6" }}>
          <p style={{ margin: "4px 0" }}>Subtotal productos: <strong>${subtotalBruto.toFixed(2)}</strong></p>
          
          {cuponAplicado && (
            <p style={{ margin: "4px 0", color: "#d9534f" }}>
              Descuento ({cuponAplicado.porcentaje}%): <strong>-${descuentoPesos.toFixed(2)}</strong>
            </p>
          )}
        </div>

        <hr />

        <h3>Total a pagar: ${precioTotal().toFixed(2)}</h3>
        <button onClick={eliminarCarrito} className={styles.botonVaciar}>Vaciar Carrito Completo</button>
        <Link to="/" onClick={() => { alert("Gracias por su compra"); eliminarCarrito(); }} className={styles.botonCheckout}>
          Finalizar la compra y Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default Carrito;
