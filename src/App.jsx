import { Routes, Route } from "react-router-dom";

import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderStatus from "./pages/OrderStatus";

import "./App.css";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Menu />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/order-success"
        element={<OrderSuccess />}
      />

      <Route
        path="/order"
        element={<OrderStatus />}
      />

    </Routes>
  );
}

export default App;