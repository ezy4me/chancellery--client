import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spin } from "antd";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import Favorites from "../client/pages/Favorite/Favorite";
import Contacts from "../client/pages/Contacts/Contacts";

const Home = lazy(() => import("../client/pages/Home/Home"));
const Catalog = lazy(() => import("../client/pages/Catalog/Catalog"));
const Checkout = lazy(() => import("../client/pages/Checkout/Checkout"));
const Profile = lazy(() => import("../client/pages/Profile/Profile"));
const NotFound = lazy(() => import("../client/pages/NotFound/NotFound"));
const AdminDashboard = lazy(() => import("../admin/pages/Dashboard"));
const AdminProducts = lazy(() => import("../admin/pages/ProductsDashboard"));
const AdminOrders = lazy(() => import("../admin/pages/OrdersDashboard"));
const AdminUsers = lazy(() => import("../admin/pages/UsersDashboard"));
const AdminCategories = lazy(
  () => import("../admin/pages/CategoriesDashboard")
);
const AdminSuppliers = lazy(() => import("../admin/pages/SuppliersDashboard"));

const AppRouter = () => {
  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          style={{ display: "block", margin: "auto", marginTop: 50 }}
        />
      }>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contacts" element={<Contacts />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="profile" element={<Profile />} />{" "}
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="suppliers" element={<AdminSuppliers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
