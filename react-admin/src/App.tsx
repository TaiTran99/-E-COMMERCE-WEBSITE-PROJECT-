import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";
import DashboardPage from "./views/pages/DashboardPage";
import LoginPage from "./views/pages/LoginPage";
import NoPage from "./views/pages/NoPage";
import LayoutAdmin from "./views/component/layouts/LayoutAdmin";
import CategoriesPage from "./views/pages/CategoriesPage";
import BrandsPage from "./views/pages/BrandsPage";
import ProductsPage from "./views/pages/ProductPage";
import CustomerPage from "./views/pages/CustomersPage";
import StaffsPage from "./views/pages/StaffsPage";
import OrdersPage from "./views/pages/OrderPage/OrdersPage";
import ProductEditPage from "./views/pages/ProductPage/ProductEditPage";
import ProductAddPage from "./views/pages/ProductPage/ProductAddPage";
import OrderViewmorePage from "./views/pages/OrderPage/OrderViewMorePage";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LayoutAdmin />}>
              <Route index element={<DashboardPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/add" element={<ProductAddPage />} />
              <Route path="/products/:id" element={<ProductEditPage />} />
              <Route path="/customers" element={<CustomerPage />} />
              <Route path="/staffs" element={<StaffsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderViewmorePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;