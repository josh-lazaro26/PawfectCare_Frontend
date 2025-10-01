import React, { useState, useEffect } from "react";
import OVSLogo from "../../assets/Admin-Page-Image/OVSLogo.png";
import { useNavigate } from "react-router-dom";
import TopNavAdmin from "../../Components/Navigation/TopNavAdmin";
import EmailSentModal from "../../Components/Modals/EmailSentModal";
import LoadingModal from "../../Components/Modals/LoadingModal";
import { getApiBaseUrl } from "../../../../Backend/config/API_BASE_URL";

function AdoptionRequest() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("loggedInAdmin");
    navigate("/user/login", { replace: true });
  };

  // Fetch adoption requests
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${getApiBaseUrl()}/dashboard/user/adoption/detail`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch adoption requests");
      }

      const data = await res.json();
      const formatted = data.map((item) => ({
        id: item.adoption_id,
        pet_id: item.pet_id,
        user_id: item.user_id,
        email: item.email,
        adopterName: item.adopter_name,
        petName: item.name,
        dateRequested: item.dateRequested,
        dateAdopted: item.dateAdopted,
        status: item.status,
        purpose: item.purpose_of_adoption,
      }));

      setRequests(formatted);
    } catch (err) {
      console.error("Error fetching adoption requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/adoption/${selectedRequest.id}/adoptionApproved`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            adopterName: selectedRequest.adopterName,
            email: selectedRequest.email,
            petName: selectedRequest.petName,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to approve adoption");

      await fetchRequests();
      setEmailSent(true); // ✅ Show confirmation modal
    } catch (err) {
      console.error("Error approving request:", err);
      alert(err.message);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    setLoading(true); // ✅ show loading modal

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/adoption/${selectedRequest.id}/adoptionRejected`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            adopterName: selectedRequest.adopterName,
            email: selectedRequest.email,
            petName: selectedRequest.petName,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to reject adoption");

      await fetchRequests();
      setEmailSent(true); // ✅ show success modal
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert(err.message);
    } finally {
      setLoading(false); // ✅ hide loading modal
      closeModal();
    }
  };

  const handleReview = (request) => {
    setSelectedRequest(request);
    setShowReviewModal(true);
  };

  const closeModal = () => {
    setShowReviewModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen flex carret-transparent">
      <div className="flex-grow p-6 carret-transparent">
        <TopNavAdmin handleSignOut={handleSignOut} />

        {/* Adoption Requests Table */}
        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-4">Adoption Requests</h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-600">
                <th className="py-3 px-4">Adopter Name</th>
                <th className="py-3 px-4">Pet Name</th>
                <th className="py-3 px-4">Date Requested</th>
                <th className="py-3 px-4">Date Adopted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No adoption requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr
                    key={req.id}
                    className={`border-t hover:bg-gray-50 ${
                      req.status === "Approved"
                        ? "bg-green-100"
                        : req.status === "Rejected"
                        ? "bg-red-100"
                        : ""
                    }`}
                  >
                    <td className="py-2 px-4">{req.adopterName}</td>
                    <td className="py-2 px-4">{req.petName}</td>
                    <td className="py-2 px-4">
                      {req.dateRequested
                        ? new Date(req.dateRequested).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "Waiting for admin response"}
                    </td>
                    <td className="py-2 px-4">
                      {req.dateAdopted
                        ? new Date(req.dateAdopted).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "Waiting for your response"}
                    </td>
                    <td className="py-2 px-4 font-semibold">{req.status}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleReview(req)}
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
        {showReviewModal && selectedRequest && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                Review Adoption Request
              </h2>
              <div className="mb-4">
                <p>
                  <strong>Adopter Name:</strong> {selectedRequest.adopterName}
                </p>
                <p>
                  <strong>Pet Name:</strong> {selectedRequest.petName}
                </p>
                <p>
                  <strong>Date Requested:</strong>{" "}
                  {selectedRequest.dateRequested
                    ? new Date(
                        selectedRequest.dateRequested
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not available"}
                </p>
                <p>
                  <strong>Purpose:</strong> {selectedRequest.purpose}
                </p>
                <p>
                  <strong>Status:</strong> {selectedRequest.status}
                </p>
              </div>

              {selectedRequest.status === "Pending" ? (
                <div className="flex justify-center space-x-3">
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
                    Cancel
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
        message="Adoption status has been sent successfully."
        onClose={() => setEmailSent(false)}
      />
    </div>
  );
}

export default AdoptionRequest;
