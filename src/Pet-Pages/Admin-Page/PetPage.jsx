import React, { useState, useEffect } from "react";
import Delete from "../../assets/Pet-Page-Image/Delete.svg";
import Edit from "../../assets/Pet-Page-Image/Edit.svg";
import { useNavigate } from "react-router-dom";
import TopNavAdmin from "../../Components/Navigation/TopNavAdmin";
import { getApiBaseUrl } from "../../../../Backend/config/API_BASE_URL";

function PetPage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  const handleSignOut = () => {
    localStorage.removeItem("loggedInAdmin");
    navigate("/user/login", { replace: true });
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    size: "",
    gender: "",
    weight: "",
    medical_status: [],
    otherMedical: "",
    color: "",
    status: "Available",
    image: "",
    imageFile: null,
  });

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`, // remove "Bearer " if backend doesn't expect it
      },
    });

    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const data = await fetchWithAuth(`${getApiBaseUrl()}/pets/getAllPets`);
      if (Array.isArray(data)) {
        setPets(data);
      } else if (Array.isArray(data.pets)) {
        setPets(data.pets);
      } else {
        setPets([]);
      }
    } catch (err) {
      console.error("Error fetching pets:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let medicalHistory = [...formData.medical_status];
    if (
      medicalHistory.includes("Other") &&
      formData.otherMedical.trim() !== ""
    ) {
      medicalHistory = medicalHistory.filter((m) => m !== "Other");
      medicalHistory.push(`Other: ${formData.otherMedical.trim()}`);
    }

    const payload = {
      name: formData.name,
      breed: formData.breed,
      size: formData.size,
      gender: formData.gender,
      weight: formData.weight,
      color: formData.color,
      status: formData.status,
      medical_status: medicalHistory.join(", "),
      image: formData.image, // already base64 string from FileReader
    };

    const url = editingPet
      ? `${getApiBaseUrl()}/pets/updatePet/${editingPet.pet_id}`
      : `${getApiBaseUrl()}/pets/addPet`;

    const method = editingPet ? "PUT" : "POST";

    await fetchWithAuth(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    fetchPets();
    closeForm();
  };

  const confirmDelete = async () => {
    if (!petToDelete) return;

    try {
      const data = await fetchWithAuth(
        `${getApiBaseUrl()}/pets/deletePet/${petToDelete.pet_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Delete response:", data);

      // Update UI
      setPets((prev) =>
        prev.filter((pet) => pet.pet_id !== petToDelete.pet_id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete pet");
    } finally {
      setShowDeleteModal(false);
      setPetToDelete(null);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openForm = (pet = null) => {
    if (pet) {
      let medicalArr = pet.medical_status
        ? pet.medical_status.split(",").map((m) => m.trim())
        : [];
      let otherMedicalText = "";

      medicalArr = medicalArr.filter((m) => {
        if (m.startsWith("Other:")) {
          otherMedicalText = m.replace("Other:", "").trim();
          return false;
        }
        return true;
      });

      if (otherMedicalText) {
        medicalArr.push("Other");
      }

      setEditingPet(pet);
      setFormData({
        name: pet.name || "",
        breed: pet.breed || "",
        size: pet.size || "",
        gender: pet.gender || "",
        weight: pet.weight || "",
        medical_status: medicalArr,
        otherMedical: otherMedicalText,
        color: pet.color || "",
        status: pet.status || "Available",
        image: pet.imageUrl || "", // ✅ FIXED
        imageFile: null,
      });
    } else {
      setEditingPet(null);
      setFormData({
        name: "",
        breed: "",
        size: "",
        gender: "",
        weight: "",
        medical_status: [],
        otherMedical: "",
        color: "",
        status: "Available",
        image: "",
        imageFile: null,
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPet(null);
    setFormData({
      name: "",
      breed: "",
      size: "",
      gender: "",
      weight: "",
      medical_status: [],
      otherMedical: "",
      color: "",
      status: "Available",
      image: "",
      imageFile: null,
    });
  };

  const openDeleteModal = (pet) => {
    setPetToDelete(pet);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPetToDelete(null);
  };

  return (
    <div className="min-h-screen flex carret-transparent">
      <div className="flex-grow p-6 carret-transparent">
        <TopNavAdmin handleSignOut={handleSignOut} />
        {/* Pet Table */}
        <div className="bg-white p-6 rounded-md shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Pet List</h2>
            <button
              onClick={() => openForm()}
              className="bg-[#560705] text-white px-4 py-2 rounded hover:bg-black transition"
            >
              + Add Pet
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-600">
                <th className="py-3">Image</th>
                <th className="py-3">Name</th>
                <th className="py-3">Breed</th>
                <th className="py-3">Size</th>
                <th className="py-3">Gender</th>
                <th className="py-3">Color</th>
                <th className="py-3">Weight</th>
                <th className="py-3">medical Status</th>
                <th className="py-3">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr
                  key={pet.pet_id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-2">
                    <img
                      src={pet.imageUrl || pet.image}
                      className="w-12 h-12 rounded object-cover"
                      alt={pet.name}
                    />
                  </td>
                  <td className="py-2">{pet.name}</td>
                  <td className="py-2">{pet.breed}</td>
                  <td className="py-2">{pet.size}</td>
                  <td className="py-2">{pet.gender}</td>
                  <td className="py-2">{pet.color}</td>
                  <td className="py-2">{pet.weight} KG</td>
                  <td className="py-2">{pet.medical_status}</td>
                  <td className="py-2 font-semibold">
                    {pet.status === "Available" && (
                      <span className="text-green-600">Available</span>
                    )}
                    {pet.status === "Unavailable" && (
                      <span className="text-yellow-600">Unavailable</span>
                    )}
                  </td>
                  <td className="py-2 space-x-2">
                    {/* Edit Pet Info Button */}
                    <button
                      onClick={() => openForm(pet)}
                      className="text-blue-500 hover:underline"
                    >
                      <img
                        src={Edit}
                        alt="Edit Icon"
                        className="h-6 w-6 relative top-1"
                      />
                    </button>
                    {/* Delete Pet Button */}
                    <button
                      onClick={() => openDeleteModal(pet)}
                      className="hover:opacity-70"
                      aria-label={`Delete ${pet.name}`}
                      title="Delete"
                    >
                      <img
                        src={Delete}
                        alt="Delete Icon"
                        className="h-7 w-7 relative top-1"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-[700px] max-w-3xl">
              <h2 className="text-2xl font-semibold mb-4">
                {editingPet ? "Edit Pet" : "Add Pet"}
              </h2>

              <form className="space-y-3" onSubmit={handleSubmit}>
                {/* Pet Name & Breed */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Pet Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input
                    type="text"
                    name="breed"
                    placeholder="Breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                {/* Size & Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">Select Size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Color & Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    value={formData.color}
                    onChange={handleChange}
                    className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex items-center border rounded w-full overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          weight: Math.max(
                            (parseInt(formData.weight) || 0) - 1,
                            0
                          ),
                        })
                      }
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300"
                    >
                      -
                    </button>

                    {/* Number + KG inline, no gap */}
                    <div className="flex items-center justify-center flex-1">
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-16 text-center outline-none -ml-5 border-none p-2 
                 [&::-webkit-outer-spin-button]:appearance-none 
                 [&::-webkit-inner-spin-button]:appearance-none 
                 [-moz-appearance:textfield]"
                        min="0"
                      />
                      <span className="text-gray-600 -ml-5">KG</span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          weight: (parseInt(formData.weight) || 0) + 1,
                        })
                      }
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Medical Status */}
                <div>
                  <label className="block mb-1 font-medium">
                    Medical Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Vaccinated", "Dewormed", "Spayed/Neutered", "Other"].map(
                      (option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            name="medical_status"
                            value={option}
                            checked={formData.medical_status?.includes(option)}
                            onChange={(e) => {
                              const { value, checked } = e.target;
                              let updatedMedical = [
                                ...(formData.medical_status || []),
                              ];
                              if (checked) updatedMedical.push(value);
                              else
                                updatedMedical = updatedMedical.filter(
                                  (item) => item !== value
                                );
                              setFormData({
                                ...formData,
                                medical_status: updatedMedical,
                              });
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>{option}</span>
                        </label>
                      )
                    )}
                  </div>

                  {formData.medical_status?.includes("Other") && (
                    <input
                      type="text"
                      name="otherMedical"
                      placeholder="Please specify"
                      value={formData.otherMedical || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          otherMedical: e.target.value,
                        })
                      }
                      className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"
                    />
                  )}
                </div>

                {/* Upload Image */}
                <div>
                  <label className="block mb-1 font-medium">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mt-2 w-24 h-24 object-cover rounded"
                    />
                  )}
                </div>
                {/* Buttons */}
                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#560705] text-white px-4 py-2 rounded hover:bg-black"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-80">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p>
                Are you sure you want to delete{" "}
                <strong>{petToDelete?.name}</strong>?
              </p>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-[#703736] text-white px-4 py-2 rounded hover:bg-slate-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PetPage;
