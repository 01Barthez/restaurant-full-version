import { RouteConfig } from "@/types/routes.types";
import { Route } from "react-router-dom";

// Convert route config to React Router elements
export const renderRoutes = (routesToRender: RouteConfig[]) => {
  return routesToRender.map((route, index) => {
    if (route.children) {
      return (
        <Route key={index} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    
    return route.index ? (
      <Route key={index} index element={route.element} />
    ) : (
      <Route key={index} path={route.path} element={route.element} />
    );
  });
};
