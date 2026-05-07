import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import LandingPage from '../pages/users/LandingPage';
import Login from '../pages/auth/Login';
import AddProperty from '../pages/admin/AddProperty';
import PropertyList from '../pages/admin/PropertyList'; // Tambahkan Impor Ini
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import {UserList} from "../pages/admin/UserList.jsx";
import {OrderList} from "../pages/admin/OrderList.jsx";
import PropertyDetail from "../pages/users/PropertyDetail.jsx";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/property/:id",
        element: <PropertyDetail />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
        <ProtectedRoute isAdminOnly={true}>
          <AdminLayout />
        </ProtectedRoute>
    ),
    children: [
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/properties", element: <PropertyList /> },
      { path: "/admin/add", element: <AddProperty /> },
      { path: "/admin/users", element: <UserList /> },
      { path: "/admin/orders", element: <OrderList /> },
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default router;
