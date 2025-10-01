import React, { useState, useEffect } from "react";
import OVSLogo from "../../assets/Admin-Page-Image/OVSLogo.png";
import { useNavigate } from "react-router-dom";
import TopNavAdmin from "../../Components/Navigation/TopNavAdmin";
import LoadingModal from "../../Components/Modals/LoadingModal";
import EmailSentModal from "../../Components/Modals/EmailSentModal";
import { getApiBaseUrl } from "../../../../Backend/config/API_BASE_URL";

function AppointmentPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("loggedInAdmin");
    navigate("/user/login", { replace: true });
  };

  const fetchAppointments = async () => {
    try {
      let url = `${getApiBaseUrl()}/process/getAllAppointment`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const handleReview = (appointment) => {
    setSelectedAppointment(appointment);
    setShowReviewModal(true);
  };

  const handleApprove = async () => {
    if (!selectedAppointment) return;
    setLoading(true);
    console.log(selectedAppointment.appointmentSetter);
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/appointment/${
          selectedAppointment.appointment_id
        }/approved`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            appointmentSetter: selectedAppointment.appointmentSetter,
            email: selectedAppointment.email,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to approve appointment");

      await fetchAppointments();
      setEmailSent(true);
    } catch (err) {
      console.error("Error approving request:", err);
      alert(err.message);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleReject = async () => {
    if (!selectedAppointment) return;
    setLoading(true); // ✅ show loading modal

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/appointment/${
          selectedAppointment.appointment_id
        }/rejected`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            appointmentSetter: selectedAppointment.appointmentSetter,
            email: selectedAppointment.email,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to reject appointment");

      // ⬇️ FIXED: call fetchAppointments instead of fetchRequests
      await fetchAppointments();
      setEmailSent(true); // ✅ show success modal
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert(err.message);
    } finally {
      setLoading(false); // ✅ hide loading modal
      closeModal();
    }
  };

  const closeModal = () => {
    setShowReviewModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="min-h-screen flex carret-transparent">
      <div className="flex-grow p-6 carret-transparent">
        <TopNavAdmin handleSignOut={handleSignOut} />
        {/* Appointments Table */}
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-4">Scheduled Appointments</h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-600">
                <th className="py-3 px-4">Owner Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr
                    key={appt.appointment_id}
                    className={`border-t hover:bg-gray-50 ${
                      appt.review === "Approve"
                        ? "bg-green-100"
                        : appt.review === "Reject"
                        ? "bg-red-100"
                        : ""
                    }`}
                  >
                    <td className="py-2 px-4">
                      {appt.first_name
                        ? appt.first_name.charAt(0).toUpperCase() +
                          appt.first_name.slice(1).toLowerCase()
                        : ""}{" "}
                      {appt.last_name
                        ? appt.last_name.charAt(0).toUpperCase() +
                          appt.last_name.slice(1).toLowerCase()
                        : ""}
                    </td>

                    <td className="py-2 px-4">
                      {new Date(appt.appointment_date)
                        .toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })
                        .replaceAll("/", "-")}
                    </td>
                    <td className="py-2 px-4">
                      {new Date(
                        `1970-01-01T${appt.timeSchedule}`
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="py-2 px-4">{appt.appointment_type}</td>
                    <td className="py-2 px-4 font-semibold">{appt.review}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleReview(appt)}
                        className="text-blue-600 hover:underline"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Review Modal */}
        {showReviewModal && selectedAppointment && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Review Appointment</h2>
              <div className="mb-4">
                <p>
                  <strong>Owner Name:</strong> {selectedAppointment.first_name}{" "}
                  {selectedAppointment.last_name}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedAppointment.appointment_date)
                    .toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })
                    .replaceAll("/", "-")}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(
                    `1970-01-01T${
                      selectedAppointment.timeSchedule ||
                      selectedAppointment.time_schedule
                    }`
                  ).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p>
                  <strong>Service:</strong>{" "}
                  {selectedAppointment.appointment_type}
                </p>
                <p>
                  <strong>Status:</strong> {selectedAppointment.review}
                </p>
              </div>

              {selectedAppointment.review === "Pending" ? (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleApprove}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel Review
                  </button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <LoadingModal isOpen={loading} message="Sending email..." />
      <EmailSentModal
        isOpen={emailSent}
        message="Appointment status has been sent successfully."
        onClose={() => setEmailSent(false)}
      />
    </div>
  );
}

export default AppointmentPage;
