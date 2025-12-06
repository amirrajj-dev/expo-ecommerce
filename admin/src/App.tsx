import { useAuth } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/login/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProductsPage from "./pages/products/Products";
import OrdersPage from "./pages/orders/OrdersPage";
import CustomersPage from "./pages/customers/CustomersPage";
import PageLoader from "./components/loaders/PageLoader";
const App = () => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) {
    return <PageLoader />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isSignedIn ? <Navigate to={"/dashboard"} /> : <LoginPage />}
      />
      <Route
        path="/"
        element={isSignedIn ? <DashboardLayout /> : <Navigate to={"/login"} />}
      >
        <Route index element={<Navigate to={"/dashboard"} />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
      </Route>
    </Routes>
  );
};

export default App;
