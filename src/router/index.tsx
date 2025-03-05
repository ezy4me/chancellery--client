import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "../layouts/MainLayout";
// import AdminLayout from "../layouts/AdminLayout";
// import ManagerLayout from "../layouts/ManagerLayout";
import AuthLayout from "../layouts/AuthLayout";
import Favorites from "../client/pages/Favorite/Favorite";

const Home = lazy(() => import("../client/pages/Home/Home"));
// const Login = lazy(() => import("../pages/Login"));
// const Register = lazy(() => import("../pages/Register"));
// const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
// const ManagerDashboard = lazy(() => import("../pages/manager/Dashboard"));
const Catalog = lazy(() => import("../client/pages/Catalog/Catalog"));
// const Orders = lazy(() => import("../pages/Orders"));
const NotFound = lazy(() => import("../client/pages/NotFound/NotFound"));

const AppRouter = () => {
  return (
      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/favorites" element={<Favorites />} />
            {/* <Route path="products" element={<Products />} /> */}
            {/* <Route path="orders" element={<Orders />} /> */}
          </Route>

          <Route path="/auth" element={<AuthLayout />}>
            {/* <Route path="login" element={<Login />} /> */}
            {/* <Route path="register" element={<Register />} /> */}
          </Route>

          {/* <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboard />} />
          </Route> */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
  );
};

export default AppRouter;
