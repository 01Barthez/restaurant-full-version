import LoaderPage from "@/Layout/LoaderPage";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const AdminLayout = () => {
  // Add admin check here
  const isAdmin = true; // Replace with actual admin check
  
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <Suspense fallback={<LoaderPage />}>
      <Outlet />
    </Suspense>
  );
};

