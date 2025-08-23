import LoaderPage from "@/Layout/LoaderPage";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const UserLayout = () => {
  // Add authentication check here
  const isAuthenticated = true; // Replace with actual auth check
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Suspense fallback={<LoaderPage />}>
      <Outlet />
    </Suspense>
  );
};

