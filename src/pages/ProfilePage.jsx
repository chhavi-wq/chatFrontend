import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";

import assets from "../assets/assets";

import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      await updateProfile({
        fullName: name,
        bio,
      });

      navigate("/");
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(selectedImage);

    reader.onload = async () => {
      const base64Image = reader.result;

      await updateProfile({
        profilePic: base64Image,
        fullName: name,
        bio,
      });

      navigate("/");
    };
  };

  return (
  <div
    className="
      min-h-screen
      flex
      items-center
      justify-center
      px-4
      py-10
      bg-[#06152e]
      bg-cover
      bg-center
      relative
      overflow-hidden
    "
    style={{
      backgroundImage: `url(${assets.login_bg})`,
    }}
  >
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-[#020b1c]/70 backdrop-blur-[3px]" />

    {/* Blue glow - top left */}
    <div
      className="
        absolute
        -top-32
        -left-32
        w-96
        h-96
        rounded-full
        bg-blue-600/20
        blur-3xl
      "
    />

    {/* Blue glow - bottom right */}
    <div
      className="
        absolute
        -bottom-32
        -right-32
        w-96
        h-96
        rounded-full
        bg-cyan-500/10
        blur-3xl
      "
    />

    {/* Main Card */}
    <div
      className="
        relative
        z-10
        w-full
        max-w-3xl
        flex
        items-center
        justify-between
        gap-10
        p-8
        sm:p-10
        max-sm:flex-col-reverse
        rounded-3xl
        border
        border-white/20
        bg-white/10
        backdrop-blur-2xl
        shadow-2xl
        shadow-black/40
      "
    >
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="
          flex
          flex-col
          gap-5
          flex-1
          w-full
        "
      >
        {/* Heading */}
        <div className="mb-2">
          <h3 className="text-2xl font-semibold text-white">
            Profile Details
          </h3>

          <p className="text-sm text-blue-100/50 mt-1">
            Update your profile information
          </p>
        </div>

        {/* Profile Image Upload */}
        <label
          htmlFor="avatar"
          className="
            flex
            items-center
            gap-4
            cursor-pointer
            group
            w-fit
          "
        >
          <input
            onChange={(e) =>
              setSelectedImage(e.target.files[0])
            }
            type="file"
            id="avatar"
            accept=".png, .jpg, .jpeg"
            hidden
          />

          {/* Small profile image */}
          <div
            className="
              w-14
              h-14
              rounded-full
              p-[2px]
              bg-gradient-to-br
              from-blue-400
              to-blue-700
              shrink-0
            "
          >
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt="Profile"
              className="
                w-full
                h-full
                rounded-full
                object-cover
                border-2
                border-[#071832]
              "
            />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              Upload profile image
            </p>

            <p className="text-xs text-blue-100/40 mt-1">
              PNG, JPG or JPEG
            </p>
          </div>
        </label>

        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-blue-100/80">
            Your Name
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Enter your name"
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

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-blue-100/80">
            About You
          </label>

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            rows={4}
            placeholder="Write a short bio..."
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

        {/* Save Button */}
        <button
          className="
            w-full
            mt-2
            py-3
            rounded-xl
            text-white
            font-semibold
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
          type="submit"
        >
          Save Changes
        </button>
      </form>

      {/* Large Profile Image */}
      <div className="flex flex-col items-center gap-4 shrink-0">
        <div
          className="
            w-44
            h-44
            sm:w-52
            sm:h-52
            rounded-full
            p-[3px]
            bg-gradient-to-br
            from-blue-400
            via-blue-600
            to-cyan-500
            shadow-2xl
            shadow-blue-900/40
          "
        >
          <img
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : authUser?.profilePic || assets.logo_icon
            }
            className="
              w-full
              h-full
              rounded-full
              object-cover
              border-4
              border-[#071832]
            "
            alt="Profile"
          />
        </div>

        <p className="text-sm text-blue-100/50">
          Profile Preview
        </p>
      </div>
    </div>
  </div>
);
};

export default ProfilePage;