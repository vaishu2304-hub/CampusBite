import { Routes, Route } from "react-router-dom";

import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

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

    </Routes>
  );
}

export default App;