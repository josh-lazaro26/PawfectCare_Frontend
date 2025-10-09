import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../../../Backend/config/API_BASE_URL";

export default function UserRegistrationPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    monthly_salary: "",
    birthdate: "",
    age: "",
    sex: "",
    address: "", // ✅ added
    password: "",
    confirmPassword: "", // ✅ added
    role: "pet owner",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "birthdate") {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      setFormData((prev) => ({ ...prev, birthdate: value, age }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          monthly_salary: formData.monthly_salary,
          birthdate: formData.birthdate,
          age: formData.age,
          sex: formData.sex,
          address: formData.address,
          password: formData.password,
          role: "pet owner",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful!");
      // navigate("/user/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6] px-4">
      <div className="relative z-10 w-full max-w-lg space-y-6 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8">
        {/* Logo */}
        <div className="text-center">
          <div className="text-3xl font-semibold text-[#a16f4a] flex items-center justify-center gap-2">
            <span role="img" aria-label="paw">
              🐾
            </span>{" "}
            Pawfect Care
          </div>
        </div>

        {/* Registration Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-amber-900">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-3 py-2 border border-[#a16f4a] rounded-full focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
            <div>
              <label className="text-sm text-amber-900">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-3 py-2 border border-[#a16f4a] rounded-full focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-amber-900">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-3 py-2 border border-[#a16f4a] rounded-full focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>

          {/* Birthdate & Sex */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-amber-900">Date of Birth</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#a16f4a] rounded-full focus:ring-2 focus:ring-amber-400"
                required
              />
              {formData.age && <p className="text-xs text-gray-600 mt-1"></p>}
            </div>
            <div>
              <label className="text-sm text-amber-900">Sex</label>
              <div className="relative">
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#a16f4a] rounded-full bg-white appearance-none focus:ring-2 focus:ring-amber-400"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Monthly Salary & Address */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-amber-900">Monthly Income</label>
              <div className="relative">
                <select
                  name="monthly_salary"
                  value={formData.monthly_salary}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#a16f4a] rounded-full bg-white appearance-none focus:ring-2 focus:ring-amber-400"
                  required
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Below₱5,000">₱0 - ₱5,000</option>
                  <option value="₱5,000-₱10,000">₱5,000 - ₱10,000</option>
                  <option value="₱10,001-₱20,000">₱10,001 - ₱20,000</option>
                  <option value="₱20,001-₱40,000">₱20,001 - ₱40,000</option>
                  <option value="₱40,001-₱60,000">₱40,001 - ₱60,000</option>
                  <option value="Above₱60,000">Above ₱60,000</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm text-amber-900">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="w-full px-3 py-2 border border-[#a16f4a] rounded-full focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-amber-900">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-3 py-2 border border-[#a16f4a] rounded-full pr-8 focus:ring-2 focus:ring-amber-400"
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-amber-700"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </div>
            </div>
          </div>

          {/* Confirm Password (moved below) */}
          <div>
            <label className="text-sm text-amber-900">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border border-[#a16f4a] rounded-full pr-8 focus:ring-2 focus:ring-amber-400"
                required
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-amber-700"
              >
                {showConfirmPassword ? <Eye /> : <EyeOff />}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full bg-[#a16f4a] text-white font-semibold text-lg hover:bg-amber-900 transition"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
