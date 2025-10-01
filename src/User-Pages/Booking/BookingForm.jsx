import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingConfirmationModal from "../../Components/Modals/BookingConfirmationModal";
import { getApiBaseUrl } from "../../../../Backend/config/API_BASE_URL";

function BookingForm() {
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    time: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check JWT token and redirect if missing
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token not found. Redirecting to login...");
      // navigate("/user/login", { replace: true });
    }
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${getApiBaseUrl()}/users/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointment_type: formData.service,
          appointment_date: formData.date,
          timeschedule: formData.time,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(true);

        //Auto-close modal & redirect after 2s
        setTimeout(() => {
          setShowModal(false);
          navigate("/user/booking-form");
        }, 2000);
      } else {
        alert(data.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Appointment Booking
        </h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Service Type
        </label>
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 mb-4 border rounded-lg ${
            formData.service === "" ? "text-gray-400" : "text-gray-900"
          }`}
        >
          <option value="">Select a service</option>
          <option value="Consultation">Consultation</option>
          <option value="Vaccination">Vaccination</option>
        </select>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 mb-4 border rounded-lg ${
            formData.date === "" ? "text-gray-400" : "text-gray-900"
          }`}
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Time
        </label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 mb-4 border rounded-lg ${
            formData.time === "" ? "text-gray-400" : "text-gray-900"
          }`}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[#a16f4a] text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition duration-300"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>

      <BookingConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default BookingForm;
