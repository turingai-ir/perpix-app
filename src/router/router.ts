import { createBrowserRouter } from "react-router";
import RootPage from "../pages/root/page";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootPage,
  },
]);

export default router;
