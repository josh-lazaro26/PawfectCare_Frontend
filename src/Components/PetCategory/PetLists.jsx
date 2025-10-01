import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../../../Backend/config/API_BASE_URL";

function PetLists({ selectedCategory, token }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const fetchPets = async () => {
      try {
        let url = `${getApiBaseUrl()}/pets/getAllPets`;

        if (selectedCategory !== "All") {
          url = `${getApiBaseUrl()}/pets/${selectedCategory}`;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch pets");
        }

        const data = await res.json();
        setPets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [selectedCategory, token]);

  if (loading) return <p className="text-center">Loading pets...</p>;

  return (
    <>
      {/* PET LIST */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
        {pets.map((pet) => (
          <div
            key={pet.pet_id}
            className="bg-white shadow-md rounded-lg p-2 sm:p-3 md:p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedPet(pet)}
          >
            <div className="aspect-square w-full">
              <img
                src={pet.imageUrl || "/default-pet.png"}
                alt={pet.name}
                className="w-full h-auto max-h-32 sm:max-h-40 md:max-h-64 object-contain rounded-lg bg-gray-100"
              />
            </div>

            <h3 className="text-xs sm:text-sm md:text-lg font-bold mt-2">
              {pet.name}
            </h3>
            <p className="text-[10px] sm:text-sm text-gray-600">{pet.breed}</p>
          </div>
        ))}
      </div>

      {/* PET DETAILS MODAL */}
      {selectedPet && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto p-6 relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedPet(null)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-black transition"
            >
              ✖
            </button>

            <div className="flex flex-col items-center">
              {/* PET IMAGE */}
              <img
                src={selectedPet.imageUrl || "/default-pet.png"}
                alt={selectedPet.name}
                className="w-full h-auto max-h-64 object-contain rounded-xl bg-gray-100"
              />

              {/* PET BASIC INFO */}
              <h2 className="text-2xl font-bold">{selectedPet.name}</h2>
              <p className="text-gray-600 mb-6">{selectedPet.breed}</p>

              {/* PET DETAILS */}
              <div className="w-full">
                <h3 className="font-semibold text-xl mb-3 text-center border-b pb-2">
                  Pet Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">{selectedPet.size}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{selectedPet.gender}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{selectedPet.weight} kg</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-medium">{selectedPet.color}</p>
                  </div>
                </div>

                {/* MEDICAL STATUS */}
                <h3 className="font-semibold text-xl mt-6 mb-3 text-center border-b pb-2">
                  Medical Status
                </h3>
                <div className="bg-green-100 p-3 rounded-lg shadow-sm text-center">
                  <p className="font-medium">
                    {selectedPet.medical_status || "No medical history"}
                  </p>
                </div>

                {/* ADOPT BUTTON */}
                <div className="mt-6 w-full flex justify-center">
                  <button
                    onClick={() =>
                      navigate("/user/adoption-form", {
                        state: { pet_id: selectedPet.pet_id },
                      })
                    }
                    className="px-6 py-2 bg-black text-white font-semibold rounded-3xl shadow-md hover:bg-gray-800 transition"
                  >
                    Adopt Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PetLists;
