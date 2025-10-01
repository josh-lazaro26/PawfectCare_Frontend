import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  DashboardRoute,
  AdoptionRequestRoute,
  AppointmentPageRoute,
  MessagesPageRoute,
} from "./Routes/AdminRoutes/AdminRoutes";
import {
  UserLoginRoute,
  AboutUsRoute,
  UserAdoptionRoute,
  UserRegistrationRoute,
  UserBookingRoute,
  UserBookingFormRoute,
  UserAdoptionFormRoute,
  UserForgotPasswordRoute,
} from "./Routes/UserRoutes/UserRoutes";
import { PetRoute } from "./Routes/PetRoutes/PetRoutes";
const routers = createBrowserRouter([
  PetRoute,
  DashboardRoute,
  AdoptionRequestRoute,
  AppointmentPageRoute,
  MessagesPageRoute,
  UserLoginRoute,
  AboutUsRoute,
  UserAdoptionRoute,
  UserRegistrationRoute,
  UserBookingRoute,
  UserBookingFormRoute,
  UserForgotPasswordRoute,
  UserAdoptionFormRoute,
]);

function App() {
  return <RouterProvider router={routers} />;
}
export default App;
