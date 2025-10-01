import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../../../Backend/config/API_BASE_URL";

function AdoptionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pet_id } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    purpose: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to adopt a pet.");
      navigate("/user/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${getApiBaseUrl()}/process/adoption`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pet_id,
          purpose_of_adoption: formData.purpose,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit adoption request");
      }

      navigate("/user/adoption", { state: { showAdoptionConfirmation: true } });
    } catch (error) {
      console.error("Error submitting adoption request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Adoption Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Purpose */}
          <div>
            <label className="block text-2xl font-medium mb-1">
              Purpose of Adoption
            </label>
            <p className="text-xl italic mb-1 text-gray-500">
              Note: This section helps ensure that the adopter is responsible
              and understands the commitment of providing a safe and loving home
              for the pet.
            </p>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              rows={15} // Increase this number to make it taller
              className="w-full border rounded-lg p-2 text-lg"
              placeholder="Explain why you want to adopt this pet"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#a16f4a] text-white text-3xl py-2 rounded-lg font-bold hover:bg-amber-900 transition"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdoptionForm;
