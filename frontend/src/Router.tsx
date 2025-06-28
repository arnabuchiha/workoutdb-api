import { createBrowserRouter } from "react-router";
import About from "./About";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);

export default router;
