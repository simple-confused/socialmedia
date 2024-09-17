import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Verify from "./components/auth/Verify";
import DashboardPage from "./components/DashboardPage";
import FriendRequestPage from "./components/FriendRequestPage";
import UpdateProfilePage from "./components/UpdateProfilePage";
import ProtectedRoute from "./utils/ProtectedRoutes";
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Signup />,
  },
  {
    path: "/verify/:id",
    element: <Verify />,
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/update-profile",
    element: (
      <ProtectedRoute>
        <UpdateProfilePage />,
      </ProtectedRoute>
    ),
  },
  {
    path: "/friend-request",
    element: (
      <ProtectedRoute>
        <FriendRequestPage />,
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
