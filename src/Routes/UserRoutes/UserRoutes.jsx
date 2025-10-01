import UserLoginPage from "../../User-Pages/Login/UserLogin";
import AboutUSPage from "../../User-Pages/AboutUs/AboutUsPage";
import UserRegistrationPage from "../../User-Pages/Registration/UserRegistration";
import AdoptionPage from "../../User-Pages/Adoption/AdoptionPage";
import BookingPage from "../../User-Pages/Booking/BookingPage";
import BookingFormPage from "../../User-Pages/Booking/BookingForm";
import AdoptionFormPage from "../../User-Pages/Adoption/AdoptionForm";
import ForgotPasswordPage from "../../User-Pages/ForgotPassword/ForgotPassword";
import ProtectedRoute from "../../Components/RouteGuard/NoRoute";

const AboutUsRoute = {
  path: "/user/about",
  element: (
    <ProtectedRoute>
      <AboutUSPage />
    </ProtectedRoute>
  ),
};
const UserLoginRoute = {
  path: "/user/login",
  element: <UserLoginPage />,
};
const UserRegistrationRoute = {
  path: "/user/registration",
  element: <UserRegistrationPage />,
};
const UserAdoptionRoute = {
  path: "/user/adoption",
  element: (
    <ProtectedRoute>
      <AdoptionPage />
    </ProtectedRoute>
  ),
};
const UserForgotPasswordRoute = {
  path: "/user/forgot-password",
  element: <ForgotPasswordPage />,
};
const UserBookingRoute = {
  path: "/user/booking",
  element: (
    <ProtectedRoute>
      <BookingPage />
    </ProtectedRoute>
  ),
};
const UserBookingFormRoute = {
  path: "/user/booking-form",
  element: (
    <ProtectedRoute>
      <BookingFormPage />
    </ProtectedRoute>
  ),
};
const UserAdoptionFormRoute = {
  path: "/user/adoption-form",
  element: (
    <ProtectedRoute>
      <AdoptionFormPage />
    </ProtectedRoute>
  ),
};

export {
  UserLoginRoute,
  AboutUsRoute,
  UserAdoptionRoute,
  UserRegistrationRoute,
  UserBookingRoute,
  UserBookingFormRoute,
  UserAdoptionFormRoute,
  UserForgotPasswordRoute,
};
