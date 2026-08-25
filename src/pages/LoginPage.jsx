import { useNavigate } from "react-router-dom";

import { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";


const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign Up");

const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const [dataSubmitted, setDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (currentState === "Sign Up" && !dataSubmitted) {
    setDataSubmitted(true);
    return;
  }

  const success = await login(
    currentState === "Sign Up" ? "signup" : "login",
    {
      fullName,
      email,
      password,
      bio,
    }
  );

  if (success) {
    navigate("/");
  }
};

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center
      justify-center gap-8 sm:justify-evenly max-sm:flex-col
      backdrop-blur-2xl"
    >
      {/* Left */}
      <img
        src={assets.logo_big}
        alt="Logo"
        className="w-[min(30vw,250px)]"
      />

      {/* Right */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500
        p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2
          className="font-medium text-2xl flex justify-between
          items-center"
        >
          {currentState}

          {dataSubmitted && (
            <img
              src={assets.arrow_icon}
              onClick={() => setDataSubmitted(false)}
              className="w-5 cursor-pointer"
              alt="Back"
            />
          )}
        </h2>

        {/* Full Name */}
        {currentState === "Sign Up" && !dataSubmitted && (
          <input
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            className="p-2 border border-gray-500 rounded-md
            focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}

        {/* Email and Password */}
        {!dataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              required
              className="p-2 border border-gray-500 rounded-md
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        {/* Bio */}
        {currentState === "Sign Up" && dataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Write a short bio..."
            required
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400
          to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currentState === "Sign Up"
            ? dataSubmitted
              ? "Create Account"
              : "Continue"
            : "Login Now"}
        </button>

        {/* Terms */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <input type="checkbox" />

          <p>
            Agree to the terms of use and privacy policy
          </p>
        </div>

        {/* Switch */}
        <div className="flex flex-col gap-2">
          {currentState === "Sign Up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}

              <span
                onClick={() => {
                  setCurrentState("Login");
                  setDataSubmitted(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}

              <span
                onClick={() => {
                  setCurrentState("Sign Up");
                  setDataSubmitted(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;