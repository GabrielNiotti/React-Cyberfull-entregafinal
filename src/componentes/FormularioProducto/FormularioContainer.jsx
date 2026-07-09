//version 1
/*import React, { useState, useEffect } from "react";
import FormularioProducto from "./FormularioProducto";
import { getFirestore, collection, addDoc } from "firebase/firestore";

function FormularioContainer({
  datosForm,
  setDatosForm,
  esEdicion,
  onUpdate,
  onCancel,
  estadoInicialForm
}) {
  const [loading, setLoading] = useState(false);
  const [imagenFile, setImagenFile] = useState(null);

  useEffect(() => {
    if (!esEdicion) {
      setImagenFile(null);
    }
  }, [esEdicion, datosForm]);

  // Funcion manejar cambio

  const manejarCambio = (evento) => {
    const { name, value, type, checked } = evento.target;
    let valorProcesado = value;

    if (
      type === "number" ||
      name === "id" ||
      name === "precio" ||
      name === "stock"
    ) {
      valorProcesado = value === "" ? "" : Number(value);
    }

    if (name === "destacado") {
      valorProcesado = type === "checkbox" ? checked : value === "true";
    }

    setDatosForm({
      ...datosForm,
      [name]: valorProcesado,
    });
  };

// Funcion Manejar cambio Imaben

  const manejarCambioImagen = (evento) => {
    if (evento.target.files && evento.target.files[0]) {
      setImagenFile(evento.target.files[0]);
    }
  };

//  -------Funcion Manejar Envio
  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    
    // Validación del Nombre (No vacío y mínimo 3 caracteres)
    if (!datosForm.nombre || datosForm.nombre.trim().length < 3) {
      alert("Por favor, ingresa un nombre válido para el producto (mínimo 3 caracteres).");
      return; // 👈 Frena la ejecución del formulario
    }

    //validacion del stock
    const valorStock = Number(datosForm.stock)
    if (isNaN(valorStock) || valorStock < 0) {
      alert ("El stock no puede ser numero negativo")
      return;
    }

    // Validación del Precio (Debe existir, ser numérico y mayor que 0)
    const precioNumerico = Number(datosForm.precio);
    if (datosForm.precio === "" || isNaN(precioNumerico) || precioNumerico <= 0) {
      alert("Por favor, ingresa un precio válido mayor a $0.");
      return; // 👈 Frena la ejecución del formulario
    }
    
    // 1. CORREGIDO: La foto SÓLO es obligatoria si estamos creando un producto nuevo
    if (!esEdicion && !imagenFile) {
      alert("Por favor, selecciona una imagen para el producto.");
      return;
    }

    setLoading(true);
    const apiKey = "680513a6746db9fd307b7f02ff71c43a";
    
    // Si no elegimos archivo nuevo al editar, mantenemos la URL de la imagen actual
    let urlImagenFinal = datosForm.imagen || ""; 

    try {
      // 2. Subimos a Imgbb sólo si el usuario seleccionó un archivo físico nuevo
      if (imagenFile) {
        console.log("Subiendo imagen a Imgbb...");
        const formData = new FormData();
        formData.append("image", imagenFile);

        const respuestaImgbb = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: formData,
          },
        );

        const datosImgbb = await respuestaImgbb.json();

        if (datosImgbb.success) {
          console.log("Imagen subida con éxito. URL:", datosImgbb.data.url);
          urlImagenFinal = datosImgbb.data.url;
        } else {
          throw new Error("La subida de la imagen a Imgbb falló.");
        }
      }

      // Consolidamos el objeto final con la imagen correspondiente (nueva o existente)
      const productoCompleto = {
        ...datosForm,
        nombre: datosForm.nombre.trim(),
        precio: Number(datosForm.precio),
        imagen: urlImagenFinal,
      };

      // 3. ENTRADA DE EDICIÓN: Evaluamos inteligentemente el flujo
      if (esEdicion) {
        console.log("Actualizando producto en Firebase:", productoCompleto);
        // Ejecutamos la función que pasaste por prop desde Gestion.js
        await onUpdate(evento, productoCompleto);
      } else {
        console.log("Creando nuevo producto en Firebase:", productoCompleto);
        const db = getFirestore();
        const productosColeccion = collection(db, "productos");
        await addDoc(productosColeccion, productoCompleto);
        alert("¡Producto guardado exitosamente en Firebase!");
        setDatosForm(estadoInicialForm);
      }

      setImagenFile(null);
      evento.target.reset(); 
    } catch (error) {
      console.error("Error en el proceso de envío:", error);
      alert("Hubo un error al procesar el producto. Por favor, intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormularioProducto
      datosForm={datosForm}
      manejarCambio={manejarCambio}
      manejarEnvio={manejarEnvio}
      manejarCambioImagen={manejarCambioImagen}
      loading={loading}
      esEdicion={esEdicion}
      onCancel={onCancel}
    />
  );
}

export default FormularioContainer;*/
