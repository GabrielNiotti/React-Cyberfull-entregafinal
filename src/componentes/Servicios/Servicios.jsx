// src/components/Servicios/Servicios.jsx
import React, { useState, useRef } from "react";
import { servicios } from "./serviciosDatos";
import styles from "./Servicios.module.css";

// ⚙️ SECCIÓN DE CONFIGURACIÓN RÁPIDA (Modifica tus datos aquí abajo)
const CONFIG_WHATSAPP = "5491124755823"; // ◄ Pon tu teléfono (Ej: 549 + área + número, sin espacios ni el "+")
const CONFIG_EMAIL = "gniotti@gmail.com"; // ◄ Pon tu dirección de correo electrónico real

const Servicios = () => {
  const [servicioActivo, setServicioActivo] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", email: "", mensaje: "" });
  const dialogRef = useRef(null);

  const abrirFormulario = (servicio) => {
    setServicioActivo(servicio);
    setFormData({
      nombre: "",
      email: "",
      mensaje: `Hola, me interesa contratar el servicio de: ${servicio.titulo}.`
    });
    dialogRef.current?.showModal();
  };

  const cerrarFormulario = () => {
    dialogRef.current?.close();
    setServicioActivo(null);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const enviarPorMail = (e) => {
    e.preventDefault();
    const asunto = encodeURIComponent(`Consulta: ${servicioActivo.titulo}`);
    const cuerpo = encodeURIComponent(`Nombre: ${formData.nombre}\nEmail: ${formData.email}\n\nMensaje:\n${formData.mensaje}`);
    window.location.href = `mailto:${CONFIG_EMAIL}?subject=${asunto}&body=${cuerpo}`;
  };

  // 🌟 CORRECCIÓN MAESTRA: Redirección forzada secuencial sin usar etiquetas "a"
  const enviarPorWhatsApp = () => {
    if (!servicioActivo) return;

    if (!formData.nombre.trim() || !formData.email.trim()) {
      alert("Por favor, completa tu Nombre y Correo antes de continuar.");
      return;
    }

    const textoMensaje = encodeURIComponent(
      `*Nueva Consulta de Servicio*\n\n` +
      `*Servicio:* ${servicioActivo.titulo}\n` +
      `*Nombre:* ${formData.nombre}\n` +
      `*Email:* ${formData.email}\n\n` +
      `*Mensaje:* ${formData.mensaje}`
    );

    // Intentamos despertar la aplicación nativa primero, si falla, abrirá la web
    const urlApp = `whatsapp://send?phone=${CONFIG_WHATSAPP}&text=${textoMensaje}`;
    const urlWeb = `https://whatsapp.com{CONFIG_WHATSAPP}&text=${textoMensaje}`;

    // Ejecutamos la redirección nativa directa de JavaScript
    const nuevaVentana = window.open(urlApp, "_blank");
    
    // Pequeño truco por si el usuario no tiene la App instalada, mandarlo a WhatsApp Web
    setTimeout(() => {
      if (!nuevaVentana || nuevaVentana.closed || typeof nuevaVentana.closed === "undefined") {
        window.open(urlWeb, "_blank");
      }
    }, 500);
  };

  return (
    <div className={styles.contenedorServicios}>
      <h2 className={styles.titulo}>Nuestros Servicios</h2>
      <hr className={styles.separador} />
      <p className={styles.bajadaText}>
        Ofrecemos soluciones tecnológicas integrales para potenciar tu negocio o mantener tu infraestructura hogareña siempre operativa.
      </p>

      <div className={styles.grillaServicios}>
        {servicios.map((serv) => (
          <div key={serv.id} className={styles.tarjetaServicio}>
            <div className={styles.contenedorImagen}>
              <img src={serv.imagen} alt={serv.titulo} className={styles.imagen} />
              <span className={styles.badgeIcono}>{serv.icono}</span>
            </div>
            
            <div className={styles.contenido}>
              <h3 className={styles.tituloServicio}>{serv.titulo}</h3>
              <p className={styles.descripcionServicio}>{serv.descripcion}</p>
              <button 
                onClick={() => abrirFormulario(serv)} 
                className={styles.botonConsulta}
              >
                Consultar Ahora
              </button>
            </div>
          </div>
        ))}
      </div>

      <dialog 
        ref={dialogRef} 
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "25px",
          maxWidth: "450px",
          width: "90%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          fontFamily: "inherit"
        }}
      >
        {servicioActivo && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ margin: 0, color: "#2c3e50" }}>Consultar Servicio</h3>
              <button 
                onClick={cerrarFormulario} 
                style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#aaa" }}
              >
                &times;
              </button>
            </div>
            
            <p style={{ margin: "0 0 20px 0", color: "#5d6d7e" }}>
              Estás consultando por: <strong>{servicioActivo.titulo}</strong>
            </p>

            <form onSubmit={enviarPorMail} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600" }}>Tu Nombre:</label>
                <input 
                  type="text" 
                  name="nombre" 
                  required 
                  value={formData.nombre} 
                  onChange={manejarCambio} 
                  placeholder="Ej: Juan Pérez"
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600" }}>Tu Correo Electrónico:</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={formData.email} 
                  onChange={manejarCambio} 
                  placeholder="ejemplo@correo.com"
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600" }}>Mensaje:</label>
                <textarea 
                  name="mensaje" 
                  rows="4" 
                  required 
                  value={formData.mensaje} 
                  onChange={manejarCambio}
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", resize: "none" }}
                ></textarea>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                <button 
                  type="submit" 
                  style={{ backgroundColor: "#2c3e50", color: "white", padding: "10px", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
                >
                  ✉ Enviar por E-mail
                </button>
                
                {/* Restaurado a botón semántico limpio que ejecuta la lógica secuencial */}
                <button 
                  type="button" 
                  onClick={enviarPorWhatsApp}
                  style={{ 
                    backgroundColor: "#25d366", 
                    color: "white", 
                    padding: "10px", 
                    border: "none",
                    borderRadius: "6px", 
                    fontWeight: "600", 
                    cursor: "pointer"
                  }}
                >
                  💬 Consultar por WhatsApp
                </button>
              </div>
            </form>
          </div>
        )}
      </dialog>
    </div>
  );
};

export default Servicios;
