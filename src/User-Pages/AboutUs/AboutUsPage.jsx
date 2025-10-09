import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DogAndCat from "../../assets/User-Page-Image/DogAndCatImage.png";
import UserNavigation from "../../Components/Navigation/TopNavUser";
import Footer from "../../Components/Footer/Footer";
import { getApiBaseUrl } from "../../../../Backend/config/API_BASE_URL";

function AboutUsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token not found. Redirecting to login...");
      return;
    }

    fetch(`${getApiBaseUrl()}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        return res.json();
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        localStorage.removeItem("token");
        navigate("/user/login", { replace: true });
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f9f7f7] text-gray-900 relative overflow-hidden">
      <UserNavigation />
      <div className="pt-[40px] -mt-1 w-full">
        <img
          src={DogAndCat}
          alt="Happy dog and cat"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* About Section */}
      <div className="px-4 md:px-20 md:pt-16 bg-white">
        <h2 className="text-lg md:text-2xl font-extrabold text-[#7c5e3b] mb-4 md:mb-6 text-left">
          ABOUT US
        </h2>
        <p className="mb-8 md:mb-16 text-sm md:text-base text-justify leading-relaxed indent-8">
          Pawfect Care is a web-based management system designed to make pet
          adoption easier and more accessible for residents of Tacurong City.
          Our platform connects adopters with loving pets in need of a home
          while also providing a seamless way to schedule veterinary
          consultations. By reducing the need for manual processing, we help
          streamline adoption efforts and ensure a smooth experience for
          adopters, pet owners, and the Tacurong City Veterinary Services
          Office.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <h4 className="text-base md:text-xl font-bold text-[#7c5e3b] mb-2 text-left">
              OUR MISSION
            </h4>
            <div className="border-t-4 border-[#7c5e3b] w-12 md:w-16 mb-3 md:mb-4 "></div>
            <p className="text-sm md:text-base text-justify leading-relaxed indent-8">
              Our mission is to create a more efficient and compassionate pet
              adoption process while ensuring that pet owners have easy access
              to veterinary services. We strive to connect animals with
              responsible owners and promote a community where every pet
              receives the care and love they deserve.
            </p>
          </div>
          <div>
            <h4 className="text-base md:text-xl font-bold text-[#7c5e3b] mb-2 text-left">
              OUR VISION
            </h4>
            <div className="border-t-4 border-[#7c5e3b] w-12 md:w-16 mb-3 md:mb-4"></div>
            <p className="text-sm md:text-base text-justify leading-relaxed indent-8">
              We envision a future where pet adoption is hassle-free, ensuring
              that every stray or abandoned pet finds a loving and responsible
              home. Through technology, we aim to bridge the gap between
              adopters and available pets, making the process simple,
              transparent, and efficient. Additionally, we seek to improve pet
              healthcare by providing an easy-to-use platform for booking
              consultations and vaccinations.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white px-4 sm:px-6 md:px-20 py-5 sm:py-16">
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#7c5e3b] mb-8 sm:mb-10">
          HOW IT WORKS?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-center text-xs sm:text-sm">
          {[
            {
              title: "Browse a pet",
              desc: "View detailed profiles of dogs and cats...",
            },
            {
              title: "Apply for adoption",
              desc: "Submit an adoption request...",
            },
            {
              title: "Schedule a Consultation",
              desc: "Easily book an appointment...",
            },
            {
              title: "Book Vaccination",
              desc: "Ensure your pet stays healthy...",
            },
            { title: "Stay Updated", desc: "Receive notifications..." },
          ].map((step, index) => (
            <div key={index} className="bg-gray-200 p-3 sm:p-4 rounded-xl">
              <h4 className="text-base sm:text-base font-bold mb-2">
                {step.title}
              </h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default AboutUsPage;
