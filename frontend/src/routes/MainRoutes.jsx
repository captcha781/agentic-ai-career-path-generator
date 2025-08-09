import Loadable from "../components/Loadable";
import RouteCondition from "../helper/RouteCondition";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Signup = Loadable(lazy(() => import("../pages/Signup")));
const Signin = Loadable(lazy(() => import("../pages/Signin")));
const VerifyEmail = Loadable(lazy(() => import("../pages/VerifyEmail")));
const CreatePassword = Loadable(lazy(() => import("../pages/CreatePassword")));
const Dashboard = Loadable(lazy(() => import("../pages/Dashboard")));
const CareerPath = Loadable(lazy(() => import("../pages/CareerPath")));
const Signout = Loadable(lazy(() => import("../pages/Signout")));

const MainRoutes = [
  {
    path: "/",
    element: <Navigate to="/signin" replace />,
  },
  {
    path: "/signup",
    element: (
      <RouteCondition type="auth">
        <Signup />
      </RouteCondition>
    ),
  },
  {
    path: "/signin",
    element: (
      <RouteCondition type="auth">
        <Signin />
      </RouteCondition>
    ),
  },
  {
    path: "/email-verify/:verificationToken",
    element: (
      <RouteCondition type="auth">
        <VerifyEmail />
      </RouteCondition>
    ),
  },
  {
    path: "/create-password",
    element: (
      <RouteCondition type="private">
        <CreatePassword />
      </RouteCondition>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <RouteCondition type="private">
        <Dashboard />
      </RouteCondition>
    ),
  },
  {
    path: "/career-path/:careerId",
    element: (
      <RouteCondition type="private">
        <CareerPath />
      </RouteCondition>
    ),
  },
  {
    path: "/signout",
    element: (
      <RouteCondition type="private">
        <Signout />
      </RouteCondition>
    ),
  },
  {
    path: "*",
    element: (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      </div>
    ),
  },
];

export default MainRoutes;
