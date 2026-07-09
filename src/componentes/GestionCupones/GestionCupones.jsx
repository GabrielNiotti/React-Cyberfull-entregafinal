import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config"; // Asegúrate de que esta ruta apunte a tu config de Firebase
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const GestionCupones = () => {
  // Estado para la lista de cupones
  const [cupones, setCupones] = useState([]);
  
  // Estado para el formulario
  const [codigo, setCodigo] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  
  // Estado para controlar la carga visual (opcional, buena práctica)
  const [cargando, setCargando] = useState(false);

  // 1. OBTENER / VISUALIZAR CUPONES (Al cargar el componente)
  useEffect(() => {
    const obtenerCupones = async () => {
      try {
        const cuponesRef = collection(db, "cupones");
        const snapshot = await getDocs(cuponesRef);
        // Mapeamos los documentos incluyendo su ID de Firestore
        const listaCupones = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCupones(listaCupones);
      } catch (error) {
        console.error("Error al traer los cupones: ", error);
      }
    };

    obtenerCupones();
  }, []);

  // 2. CREAR UN NUEVO CUPÓN
  const handleCrearCupon = async (e) => {
    e.preventDefault();

    // Validaciones básicas de seguridad antes de enviar a Firestore
    if (!codigo.trim() || !porcentaje) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setCargando(true);

    try {
      const nuevoCupon = {
        codigo: codigo.toUpperCase().trim(), // Guardamos siempre en mayúsculas
        porcentaje: Number(porcentaje),      // Forzamos tipo numérico
      };

      // Guardamos en la colección "cupones" de Firestore
      const cuponesRef = collection(db, "cupones");
      const docRef = await addDoc(cuponesRef, nuevoCupon);

      // Actualizamos el estado local inmediatamente (UI en tiempo real)
      setCupones([...cupones, { id: docRef.id, ...nuevoCupon }]);

      // Limpiamos los inputs del formulario
      setCodigo("");
      setPorcentaje("");
      alert("¡Cupón creado con éxito!");
    } catch (error) {
      console.error("Error al crear el cupón: ", error);
      alert("Hubo un error al guardar el cupón.");
    } finally {
      setCargando(false);
    }
  };

  // 3. ELIMINAR UN CUPÓN
  const handleEliminarCupon = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este cupón?");
    if (!confirmar) return;

    try {
      // Obtenemos la referencia exacta del documento mediante su ID
      const docRef = doc(db, "cupones", id);
      
      // Borramos de Firestore
      await deleteDoc(docRef);

      // Filtramos el estado local para quitarlo de la pantalla inmediatamente
      setCupones(cupones.filter((cupon) => cupon.id !== id));
      alert("Cupón eliminado.");
    } catch (error) {
      console.error("Error al eliminar el cupón: ", error);
      alert("No se pudo eliminar el cupón de la base de datos.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Administración de Cupones de Descuento</h2>
      <hr />

      {/* Formulario de Registro */}
      <form onSubmit={handleCrearCupon} style={{ marginBottom: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3>Crear Nuevo Cupón</h3>
        <div>
          <label htmlFor="codigo">Código del Cupón: </label>
          <input
            id="codigo"
            type="text"
            placeholder="EJ: VERANO20"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label htmlFor="porcentaje">Porcentaje de Descuento (%): </label>
          <input
            id="porcentaje"
            type="number"
            placeholder="15"
            min="1"
            max="100"
            value={porcentaje}
            onChange={(e) => setPorcentaje(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <button 
          type="submit" 
          disabled={cargando} 
          style={{ padding: "10px", background: "#4c6faf", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
        >
          {cargando ? "Guardando..." : "Crear Cupón"}
        </button>
      </form>

      <hr />

      {/* Listado de Cupones Activos */}
      <h3>Cupones Activos</h3>
      {cupones.length === 0 ? (
        <p>No hay cupones de descuento registrados.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cupones.map((cupon) => (
            <li 
              key={cupon.id} 
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #ccc" }}
            >
              <span>
                Código: <strong>{cupon.codigo}</strong> — Descuento: <strong>{cupon.porcentaje}%</strong>
              </span>
              <button 
                onClick={() => handleEliminarCupon(cupon.id)}
                style={{ background: "#f44336", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GestionCupones;
