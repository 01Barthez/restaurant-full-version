import LoaderPage from "@/Layout/LoaderPage";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

// Layout Wrappers
export const PublicLayout = () => (
  <Suspense fallback={<LoaderPage />}>
    <Outlet />
  </Suspense>
);

