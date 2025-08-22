import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path="/products" element={<Products />} /> */}
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
