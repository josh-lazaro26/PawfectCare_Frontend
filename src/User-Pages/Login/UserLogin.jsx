import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../../../Backend/config/API_BASE_URL";

function UserLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // try {
    //   const res = await fetch(`${getApiBaseUrl()}/users/login`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   const data = await res.json();

    //   if (!res.ok) {
    //     throw new Error(data.message || "Login failed");
    //   }

    //   //Save token & user info
    //   localStorage.setItem("token", data.token);
    //   localStorage.setItem("user", JSON.stringify(data.user));

    //   //Redirect based on role
    //   if (data.user.role === "admin") {
    //     navigate("/admin/dashboard");
    //   } else {
    navigate("/user/about");
    //   }
    // } catch (err) {
    //   setError(err.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#fdfaf6]">
      <div className="relative z-10 w-full max-w-sm space-y-6 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8">
        <div className="text-center">
          <div className="text-3xl font-semibold text-[#a16f4a] flex items-center justify-center gap-2">
            <span role="img" aria-label="paw">
              🐾
            </span>{" "}
            Pawfect Care
          </div>
        </div>
        {/*I removed the handleLogin function from OnSubmit  Original Code: <form onSubmit={handleLogin} className="space-y-4"> */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex justify-between text-sm text-amber-900">
            <label>Email</label>
            <Link
              to="/user/registration"
              className="underline text-amber-700 hover:text-amber-900"
            >
              Register
            </Link>
          </div>
          {/* I commented the required field of user and password so login can be accessed without field entered*/}
          <input
            type="email"
            className="w-full px-4 py-2 border border-[#a16f4a] rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="text-sm text-amber-900">Password</div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-[#a16f4a] rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* I also change this OnClick to navigate directly to dashboard Original Code: onClick={handleLogin}*/}
            <div
              className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-amber-700"
              onClick={togglePassword}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </div>
          </div>
          <div className="flex justify-end items-center text-sm">
            <a
              href="/forgot-password"
              className="text-amber-700 underline hover:text-amber-900"
            >
              Forgot Password?
            </a>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 rounded-full bg-[#a16f4a] text-white font-semibold text-lg hover:bg-amber-900 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserLoginPage;
