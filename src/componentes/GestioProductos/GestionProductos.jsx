import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  deleteDoc,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";

import FormularioProducto from "../FormularioProducto/FormularioProducto";
import styles from "./GestionProductos.module.css";

const Gestion = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagenFile, setImagenFile] = useState(null);
  const [productoAEditar, setProductoAEditar] = useState(null);

  const estadoInicialForm = {
    id: "",
    nombre: "",
    categoria: "",
    descripcion: "",
    destacado: false,
    precio: "",
    stock: "",
    imagen: "",
  };

  const [datosForm, setDatosForm] = useState(estadoInicialForm);

  // ===========================
  // CARGAR PRODUCTOS
  // ===========================

  const cargarProductos = async () => {
    try {
      const productosRef = collection(db, "productos");
      const resp = await getDocs(productosRef);

      setProductos(
        resp.docs.map((documento) => ({
          firestoreId: documento.id,
          ...documento.data(),
        }))
      );
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    if (productoAEditar) {
      setDatosForm(productoAEditar);
    } else {
      setDatosForm(estadoInicialForm);
      setImagenFile(null);
    }
  }, [productoAEditar]);

  // ===========================
  // INPUTS
  // ===========================

  const manejarCambio = (evento) => {
    const { name, value, type, checked } = evento.target;

    let valorProcesado = value;

    if (type === "number" || name === "precio" || name === "stock" || name === "id") {
      valorProcesado = value === "" ? "" : Number(value);
    }

    if (name === "destacado") {
      valorProcesado =
        type === "checkbox" ? checked : value === "true";
    }

    setDatosForm({
      ...datosForm,
      [name]: valorProcesado,
    });
  };

  // ===========================
  // IMAGEN
  // ===========================

  const manejarCambioImagen = (evento) => {
    if (evento.target.files && evento.target.files[0]) {
      setImagenFile(evento.target.files[0]);
    }
  };

  // ===========================
  // ELIMINAR
  // ===========================
  const handleDelete = async (firestoreId) => {

  const resultado = await Swal.fire({
    title: "¿Eliminar producto?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!resultado.isConfirmed) return;

  try {

    await deleteDoc(doc(db, "productos", firestoreId));

    setProductos(
      productos.filter(
        (prod) => prod.firestoreId !== firestoreId
      )
    );

    Swal.fire({
      icon: "success",
      title: "Producto eliminado",
      text: "El producto fue eliminado correctamente.",
      timer: 1800,
      showConfirmButton: false,
    });

  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo eliminar el producto.",
    });

  }

};
  // ===========================
  // EDITAR
  // ===========================

  const handleEditClick = (producto) => {
    setProductoAEditar(producto);
  };

  const handleCancelClick = () => {
    setProductoAEditar(null);
  };

  // ===========================
  // GUARDAR
  // ===========================

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    const esEdicion = !!productoAEditar;

    if (!datosForm.nombre || datosForm.nombre.trim().length < 3) {
      /*alert(
        "Por favor, ingresa un nombre válido para el producto."
      );*/
      Swal.fire({
        icon: "warning",
        title: "Nombre Invalido",
        text: "Por favor, ingresa un nombre válido para el producto.",
        confirmButtonColor: "#0d6efd",

      });
      return;
    }

    const valorStock = Number(datosForm.stock);

    if (isNaN(valorStock) || valorStock < 0) {
      alert("El stock no puede ser negativo.");
      return;
    }

    const precioNumerico = Number(datosForm.precio);

    if (
      datosForm.precio === "" ||
      isNaN(precioNumerico) ||
      precioNumerico <= 0
    ) {
      //alert("Ingrese un precio válido.");
      Swal.fire({
        icon: "warning",
        title: "Precio Invalido",
        text: "Ingrese un precio mayor que $0.",
      });


      return;
    }

    if (!esEdicion && !imagenFile) {
      //alert("Seleccione una imagen.");
      Swal.fire({
        icon: "warning",
        title: "Imagen requerida",
        text: "Seleccione una imagen para el producto.",
        

      });
      return;
    }
    

    setLoading(true);

    const apiKey = "680513a6746db9fd307b7f02ff71c43a";

    let urlImagenFinal = datosForm.imagen || "";

    try {
      if (imagenFile) {
        const formData = new FormData();

        formData.append("image", imagenFile);

        const respuestaImgbb = await fetch(
          "https://api.imgbb.com/1/upload?key=" + apiKey,
          {
            method: "POST",
            body: formData,
          }
        );

        const datosImgbb = await respuestaImgbb.json();

        if (datosImgbb.success) {
          urlImagenFinal = datosImgbb.data.url;
        } else {
          throw new Error("Error al subir imagen.");
        }
      }

      const productoCompleto = {
        id: Number(datosForm.id),
        nombre: datosForm.nombre.trim(),
        categoria: datosForm.categoria,
        descripcion: datosForm.descripcion,
        destacado: datosForm.destacado,
        precio: Number(datosForm.precio),
        stock: Number(datosForm.stock),
        imagen: urlImagenFinal,
      };

      if (esEdicion) {
        const docRef = doc(
          db,
          "productos",
          productoAEditar.firestoreId
        );

        await updateDoc(docRef, productoCompleto);

        setProductos(
          productos.map((prod) =>
            prod.firestoreId === productoAEditar.firestoreId
              ? {
                  ...prod,
                  ...productoCompleto,
                }
              : prod
          )
        );

        //alert("Producto actualizado correctamente.");
        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          text: "El producto ha sido actualizado correctamente.",
          showConfirmButton: false,
          timer: 1800,
        });

        setProductoAEditar(null);
      } else {
        const productosColeccion = collection(db, "productos");

        const docRef = await addDoc(
          productosColeccion,
          productoCompleto
        );

        setProductos([
          ...productos,
          {
            firestoreId: docRef.id,
            ...productoCompleto,
          },
        ]);

       // alert("Producto creado correctamente.");
       Swal.fire({
         icon: "success",
         title: "Producto creado",
         text: "El producto ha sido creado correctamente.",
         showConfirmButton: false,
         timer: 1800,
       });

        setDatosForm(estadoInicialForm);
      }

      setImagenFile(null);

      if (evento.target.reset) {
        evento.target.reset();
      }
            } catch (error) {
        console.error("Error en el proceso de envío:", error);
        /*alert(
          "Hubo un error al procesar el producto. Por favor, intentá de nuevo."
        );*/
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al procesar el producto. Por favor, intentá de nuevo.",
        });


      } finally {
        setLoading(false);
      }
    };

    return (
      <div className={styles.contenedorGestion}>
        <h2 className={styles.titulo}>Gestión de Productos</h2>

        <FormularioProducto
          datosForm={datosForm}
          manejarCambio={manejarCambio}
          manejarEnvio={manejarEnvio}
          manejarCambioImagen={manejarCambioImagen}
          loading={loading}
          esEdicion={!!productoAEditar}
          onCancel={handleCancelClick}
        />

        <hr className={styles.separador} />

        <div className={styles.contenedorLista}>
          <h3 className={styles.subtitulo}>Productos Existentes</h3>

          <table className={styles.tablaProductos}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr key={producto.firestoreId}>
                  <td>
                    <img
                      src={producto.imagen || "https://placeholder.com"}
                      alt={producto.nombre}
                      className={styles.imagenMiniatura}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </td>

                  <td>{producto.id}</td>

                  <td>{producto.nombre}</td>

                  <td>{producto.categoria}</td>

                  <td>${producto.precio}</td>

                  <td>{producto.stock}</td>

                  <td>
                    <button
                      onClick={() => handleEditClick(producto)}
                      className={styles.btnEditar}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(producto.firestoreId)
                      }
                      className={styles.btnEliminar}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default Gestion;