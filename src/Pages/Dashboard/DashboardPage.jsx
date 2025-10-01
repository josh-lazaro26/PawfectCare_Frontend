import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavAdmin from "../../Components/Navigation/TopNavAdmin";
import { getApiBaseUrl } from "../../../../Backend/config/API_BASE_URL";

function DashboardPage() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [pendingAdoptions, setPendingAdoptions] = useState(0);
  const [scheduledAppointments, setScheduledAppointments] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [pets, setPets] = useState([]);

  const handleSignOut = () => {
    localStorage.removeItem("token"); // ✅ clear JWT
    navigate("/user/login", { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [users, adoptions, appts] = await Promise.all([
          fetchWithAuth(`${getApiBaseUrl()}/dashboard/user/count`),
          fetchWithAuth(`${getApiBaseUrl()}/dashboard/user/adoption/count`),
          fetchWithAuth(`${getApiBaseUrl()}/dashboard/user/appointment/count`),
        ]);
        setUserCount(users.count || 0);
        setPendingAdoptions(adoptions.count || 0);
        setScheduledAppointments(appts.count || 0);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    }

    fetchDashboardData();
  }, []);

  // useEffect(() => {
  //   async function fetchTabData() {
  //     if (activeTab === "pets") {
  //       setPets(await fetchWithAuth(`${API_BASE_URL}/pets/getAllPets`));
  //     } else if (activeTab === "adoptions") {
  //       setAdoptionRequests(
  //         await fetchWithAuth(`${API_BASE_URL}/adoptions/pending`)
  //       );
  //     } else if (activeTab === "appointments") {
  //       setAppointments(await fetchWithAuth(`${API_BASE_URL}/appointments`));
  //     } else if (activeTab === "messages") {
  //       setMessages(await fetchWithAuth(`${API_BASE_URL}/messages`));
  //     }
  //   }

  //   fetchTabData();
  // }, [activeTab]);

  return (
    <div className="min-h-screen flex carret-transparent">
      <div className="flex-grow p-6 carret-transparent">
        <TopNavAdmin handleSignOut={handleSignOut} />
        {/* Dashboard Cards */}

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 carret-transparent">
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                User Management
              </h2>
              <div className="text-3xl font-bold text-gray-800">
                {userCount}
              </div>
            </div>
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Adoption Requests
              </h2>
              <div className="text-3xl font-bold text-gray-800">
                {pendingAdoptions}
              </div>
            </div>
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Appointment Management
              </h2>
              <div className="text-3xl font-bold text-gray-800">
                {scheduledAppointments}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
