import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState({
    fullname: "",
    email: "",
    bio: "",
    file: "",
  });

  useEffect(() => {
    axios
      .get(`${USER_API_END_POINT}/user`, { withCredentials: true })
      .then((response) => {
        setLoggedUser(response.data.user);
      })
      .catch((error) => {
        // console.error(error);
      });
  }, []);

  const [updatedUser, setUpdatedUser] = useState(loggedUser);
  const [imagePreview, setImagePreview] = useState(loggedUser.file);
  useEffect(() => {
    setUpdatedUser(loggedUser);
    setImagePreview(loggedUser.file);
  }, [loggedUser]);
  // console.log(updatedUser);
  // console.log(loggedUser);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Show the image preview
      setUpdatedUser({ ...updatedUser, file: file });
    }
  };
  // console.log(updatedUser.file);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoggedUser(updatedUser);
    const formData = new FormData();
    formData.append("fullname", loggedUser.fullname);
    formData.append("bio", loggedUser.bio);
    formData.append("file", loggedUser.file);
    console.log(formData);
    const res = await axios.post(`${USER_API_END_POINT}/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    // console.log(res.data);
    if (res.data.success) {
      navigate("/dashboard");
      toast("Profile updated successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Update Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <img
              src={imagePreview}
              alt="Profile"
              className=" h-24  border-2 border-blue-500"
            />
            <label
              htmlFor="profilePicture"
              className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Change Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              id="name"
              value={updatedUser.fullname}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={updatedUser.email}
              onChange={(e) => toast("Email Cannot be changed!")}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-gray-700 font-semibold mb-2"
            >
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              value={updatedUser.bio}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself"
              rows="4"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Save Changes
            </button>
          </div>
          <p
            className="text-center cursor-pointer "
            onClick={() => navigate("/dashboard")}
          >
            Go To Dashboard
          </p>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
