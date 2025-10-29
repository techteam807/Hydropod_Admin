import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";
import AppLayout from "./component/layout/AppLayout";
import ViewDistributor from "./pages/Distributor/ViewDistributor";
import AddDistributor from "./pages/Distributor/AddDistributor";
import ViewDealer from "./pages/Dealer/ViewDealer";
import AddDealer from "./pages/Dealer/AddDealer";
import ViewTechnician from "./pages/Technician/ViewTechnician";
import AddTechnician from "./pages/Technician/AddTechnician";
import ViewDistributorDetails from "./pages/Distributor/ViewDistributorDetails";
import ViewDistributorDealer from "./pages/Dealer/ViewDealerDetails";
import ViewDealerDetails from "./pages/Dealer/ViewDealerDetails";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <AdminRoute>
              <AppLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Home />} />
          {/* Distributor */}
          <Route path="/distributor" element={<ViewDistributor />} />
          <Route path="/distributor/add" element={<AddDistributor />} />
          <Route
            path="/distributor/edit/:distributorId"
            element={<AddDistributor />}
          />
          <Route
            path="/distributor/view/:distributorId"
            element={<ViewDistributorDetails />}
          />
          {/* Dealer */}
          <Route path="/dealer" element={<ViewDealer />} />
          <Route path="/dealer/add" element={<AddDealer />} />
          <Route path="/dealer/edit/:dealerId" element={<AddDealer />} />
          <Route
            path="/dealer/view/:dealerId"
            element={<ViewDealerDetails />}
          />
          {/* Technician */}
          <Route path="/technician" element={<ViewTechnician />} />
          <Route path="/technician/add" element={<AddTechnician />} />
          <Route
            path="/technician/edit/:technicianId"
            element={<AddTechnician />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
