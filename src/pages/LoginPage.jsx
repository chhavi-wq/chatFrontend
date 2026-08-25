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
    className="
      min-h-screen
      flex
      items-center
      justify-center
      px-4
      bg-cover
      bg-center
      relative
      overflow-hidden
      bg-[#06152e]
     
    "
    style={{
      backgroundImage: `url(${assets.login_bg})`,
    }}
  >
  

  
    {/* Form */}
    <form
      onSubmit={onSubmitHandler}
      className="
        relative
        z-10
        w-full
        max-w-md
        p-7
        sm:p-9
        flex
        flex-col
        gap-5
        rounded-2xl
        border
        border-white/20
        bg-white/10
        backdrop-blur-2xl
        shadow-2xl
        shadow-black/40
        text-white
      "
    >
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            {currentState}
          </h2>

          <p className="text-sm text-blue-100/60 mt-1">
            {currentState === "Sign Up"
              ? "Create your account and get started."
              : "Welcome back! Login to continue."}
          </p>
        </div>

        {dataSubmitted && (
          <img
            src={assets.arrow_icon}
            onClick={() => setDataSubmitted(false)}
            className="
              w-5
              h-5
              cursor-pointer
              opacity-70
              hover:opacity-100
              hover:scale-110
              transition-all
            "
            alt="Back"
          />
        )}
      </div>

      {/* Full Name */}
      {currentState === "Sign Up" && !dataSubmitted && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-blue-100/80">
            Full Name
          </label>

          <input
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            placeholder="Enter your full name"
            required
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border
              border-white/15
              bg-white/10
              text-white
              placeholder:text-blue-100/40
              outline-none
              transition-all
              duration-200
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-500/30
              focus:bg-white/15
            "
          />
        </div>
      )}

      {/* Email & Password */}
      {!dataSubmitted && (
        <>
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-blue-100/80">
              Email
            </label>

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter your email"
              required
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-white/15
                bg-white/10
                text-white
                placeholder:text-blue-100/40
                outline-none
                transition-all
                duration-200
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-500/30
                focus:bg-white/15
              "
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-blue-100/80">
              Password
            </label>

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your password"
              required
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-white/15
                bg-white/10
                text-white
                placeholder:text-blue-100/40
                outline-none
                transition-all
                duration-200
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-500/30
                focus:bg-white/15
              "
            />
          </div>
        </>
      )}

      {/* Bio */}
      {currentState === "Sign Up" && dataSubmitted && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-blue-100/80">
            About You
          </label>

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder="Write a short bio..."
            required
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border
              border-white/15
              bg-white/10
              text-white
              placeholder:text-blue-100/40
              outline-none
              resize-none
              transition-all
              duration-200
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-500/30
              focus:bg-white/15
            "
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="
          mt-2
          w-full
          py-3
          rounded-xl
          font-semibold
          text-white
          bg-gradient-to-r
          from-blue-600
          via-blue-700
          to-blue-800
          shadow-lg
          shadow-blue-900/40
          hover:from-blue-500
          hover:via-blue-600
          hover:to-blue-700
          hover:shadow-blue-500/30
          hover:-translate-y-0.5
          active:translate-y-0
          transition-all
          duration-200
          cursor-pointer
        "
      >
        {currentState === "Sign Up"
          ? dataSubmitted
            ? "Create Account"
            : "Continue"
          : "Login Now"}
      </button>

      {/* Terms */}
      <div className="flex items-start gap-2 text-xs text-blue-100/50">
        <input
          type="checkbox"
          className="
            mt-0.5
            accent-blue-600
            cursor-pointer
          "
        />

        <p>
          Agree to the terms of use and privacy policy
        </p>
      </div>

      {/* Switch Login / Signup */}
      <div className="text-center pt-1">
        {currentState === "Sign Up" ? (
          <p className="text-sm text-blue-100/60">
            Already have an account?{" "}
            <span
              onClick={() => {
                setCurrentState("Login");
                setDataSubmitted(false);
              }}
              className="
                font-semibold
                text-blue-400
                hover:text-blue-300
                cursor-pointer
                transition-colors
              "
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-sm text-blue-100/60">
            Don't have an account?{" "}
            <span
              onClick={() => {
                setCurrentState("Sign Up");
                setDataSubmitted(false);
              }}
              className="
                font-semibold
                text-blue-400
                hover:text-blue-300
                cursor-pointer
                transition-colors
              "
            >
              Create account
            </span>
          </p>
        )}
      </div>
    </form>
  </div>
);
}

export default LoginPage;