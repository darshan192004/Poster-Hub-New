import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import BusinessPoster from "./pages/BusinessPoster";
import BirthdayPoster from "./pages/BirthdayPoster";
import EventPoster from "./pages/EventPoster";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/customize/business", element: <BusinessPoster /> },
  { path: "/customize/birthday", element: <BirthdayPoster /> },
  { path: "/customize/event", element: <EventPoster /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
