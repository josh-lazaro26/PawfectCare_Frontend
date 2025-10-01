import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavigation from "../../Components/Navigation/TopNavUser";
import BookingPoster from "../../assets/User-Page-Image/BookingPoster.png";
import consultation from "../../assets/User-Page-Image/consultation.svg";
import deworm from "../../assets/User-Page-Image/deworm.svg";
import Footer from "../../Components/Footer/Footer";
import { getApiBaseUrl } from "../../../../Backend/config/API_BASE_URL";

function BookingPage() {
  const navigate = useNavigate();

  const services = [
    {
      icon: consultation,
      title: "Consultation",
      description:
        "Get expert veterinary advice and personalized care for your pets.",
    },
    {
      icon: deworm,
      title: "Vaccination",
      description:
        "Maintain your pet’s health with proper deworming and anti-rabies treatments.",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token not found. Redirecting to login...");
      // navigate("/user/login", { replace: true });
      return;
    }

    // fetch(`${getApiBaseUrl()}/users/me`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // })
    //   .then((res) => {
    //     if (!res.ok) {
    //       throw new Error("Failed to fetch user");
    //     }
    //     return res.json();
    //   })
    //   .catch((err) => {
    //     console.error("Error fetching user:", err);
    //     localStorage.removeItem("token");
    //     navigate("/user/login", { replace: true });
    //   });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <UserNavigation />

      {/* Poster Section */}
      <div className="w-full bg-[#D7DBF5] mt-[52px]">
        <img src={BookingPoster} className="w-full h-auto" />
      </div>

      {/* About / Services Section */}
      <div className="bg-[#a16f4a] py-6">
        <section className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-8 text-center font-poppins">
            We Provide Best Services
          </h2>

          {/* GRID: 2 columns on mobile, keeps 2 on small, 3 on md */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 justify-items-center">
            {services.map((service, index) => (
              <div
                key={index}
                /* NOTE: no fixed w-72 here — let the grid column size determine width */
                className="w-full max-w-xs sm:max-w-[18rem] bg-white rounded-2xl shadow-md p-3 sm:p-6 text-center hover:shadow-lg transition"
              >
                <div className="flex justify-center">
                  <div className="bg-yellow-200 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-3 sm:mb-4">
                    <img
                      src={service.icon}
                      alt={`${service.title} icon`}
                      className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                  </div>
                </div>

                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          {/* Booking Button */}
          <div className="flex justify-center mt-8 sm:mt-12">
            <button
              onClick={() => navigate("/user/booking-form")}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-black font-semibold rounded-3xl shadow-md hover:bg-gray-200 text-sm sm:text-base"
            >
              Book Now
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BookingPage;
