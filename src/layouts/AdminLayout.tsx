// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar/Sidebar";
// import { Box } from "@mui/material";
// import { FaHome, FaUserTie, FaClipboardList, FaUsers } from "react-icons/fa";

// const AdminLayout: React.FC = () => {
//   const links = [
//     { text: "Пользователи", path: "/admin/users", icon: <FaUsers /> },
//     {
//       text: "Категории услуг",
//       path: "/admin/categories",
//       icon: <FaClipboardList />,
//     },
//     { text: "Услуги", path: "/admin/services", icon: <FaHome /> },
//     { text: "Клиенты", path: "/admin/clients", icon: <FaUsers /> },
//     { text: "Работники", path: "/admin/employees", icon: <FaUserTie /> },
//     { text: "Записи", path: "/admin/appointments", icon: <FaClipboardList /> },
//   ];

//   return (
//     <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#1ba9d8" }}>
//       <Sidebar links={links} />
//       <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
//         <Box sx={{ flexGrow: 1, p: 2, backgroundColor: "#fefefe", mt: 8 }}>
//           <Outlet />
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default AdminLayout;