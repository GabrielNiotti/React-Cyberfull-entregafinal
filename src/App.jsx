import { Layout } from "./componentes/layout";
import "./App.css";
import Header from "./componentes/Layout/Header/Header";
import Footer from "./componentes/Layout/Footer/Footer";
import Productos from "./componentes/Productos/Productos";
import TarjetaProducto from "./componentes/Layout/TarjetaProducto/TarjetaProducto";
//import FormularioContainer from "./componentes/FormularioProducto/FormularioContainer";
import { Routes, Route } from "react-router-dom";
import Inicio from "./componentes/inicio/Inicio";
import Servicios from "./componentes/Servicios/Servicios";
import ProductoDetalle from "./componentes/ProductoDetalle/ProductoDetalle";
import Carrito from "./componentes/Carrito/Carrito";
import ProductosDb from "./componentes/Productos/ProductosDb/ProductosDb";
import GestionProductos from "./componentes/GestioProductos/GestionProductos";
import GestionCupones from "./componentes/GestionCupones/GestionCupones";
import Login from "./componentes/Login/Login";
import Registro from "./componentes/Registro/Registro";
import ProtectedRoute from "./componentes/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route
          path="/productos"
          element={
            <Productos Mensaje={"Nuestros productos"} Destacados={false} />
          }
        />
        <Route
          path="/productosdb"
          element={
            <ProductosDb Mensaje={"Nuestros productos"} Destacados={false} />
          }
        />
        <Route path="/productos/:id" element={<ProductoDetalle />} />
        <Route
          path="/servicios"
          element={<Servicios Mensaje={"Nuestros Servicios"} />}
        />
        <Route path="/gestion" element={
          <ProtectedRoute rolesPermitidos={["admin"]}>
            <GestionProductos />
          </ProtectedRoute>
        } />
        <Route path="/cupones" element={
          <ProtectedRoute rolesPermitidos={["admin"]}>
            <GestionCupones />
          </ProtectedRoute>
        } />

        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Route>
      
    </Routes>
  );
}

export default App;
