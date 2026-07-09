import { useState, useEffect } from "react";
import TarjetaContacto from "./TarjetaContacto";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

function Directorio() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  /* useEffect(() => {
    fetch("/data/nosotros.json")
        .then((res) => {
            if (!res.ok) throw new Error("Error de carga");
            return res.json();
        })
        .then(data => {
            setContactos(data);
            setCargando(false);
         
        })
        .catch(err =>{
            setError(err.message);
            setCargando(false)
        });

  }, [])*/

  /*useEffect(() => {
    fetch("/data/nosotros.json")
        .then((res) => {
            if (!res.ok) throw new Error("Error de carga");
            return res.json();
        })
        .then(data => {
            setContactos(data);
            setCargando(false);
         
        })
        .catch(err =>{
            setError(err.message);
            setCargando(false)
        });

  }, [])*/
  useEffect(() => {
    const equipoDB = collection(db, "equipo");

    getDocs(equipoDB)
      .then((resp) => {
        setContactos(
          resp.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          }),
        );
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (cargando) return <p>Cargando datos...</p>; //es lo primero que se renderiza, despues va al useEffect
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      className="contenedor-tarjetas-directorio"
      style={{
        display: "grid",
        /* 🌟 Forzamos a crear exactamente 4 columnas horizontales iguales */
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {contactos.map((contacto) => (
        <div key={contacto.id} style={{ width: "100%", justifySelf: "center" }}>
          <TarjetaContacto {...contacto} />
        </div>
      ))}
    </div>
  );
}

export default Directorio;
