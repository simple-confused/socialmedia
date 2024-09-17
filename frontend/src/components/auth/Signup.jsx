import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    fullname: "",
    email: "",
    password: "",
    file: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    fullname: "",
    password: "",
    file: "",
  });

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    setInputData({ ...inputData, file: e.target.files?.[0] });
  };
  const validate = () => {
    const newErrors = {};
    if (!inputData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(inputData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!inputData.fullname) {
      newErrors.fullname = "Full Name is required";
    }

    if (!inputData.password) {
      newErrors.password = "Password is required";
    } else if (inputData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      e.preventDefault();
      try {
        const formData = new FormData();
        formData.append("email", inputData.email);
        formData.append("fullname", inputData.fullname);
        formData.append("password", inputData.password);

        formData.append("file", inputData.file);
        console.log("User Registered:", formData);

        const res = await axios.post(
          `${USER_API_END_POINT}/register`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          // navigate("/login");
          toast("Registration successful! Please login.");
        }
      } catch (error) {
        console.error(error);
        toast(error.response.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="fullname"
            >
              Full Name
            </Label>
            <Input
              type="text"
              id="fullname"
              value={inputData.fullname}
              name="fullname"
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.fullname ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your full name"
            />
            {errors.fullname && (
              <p className="text-red-500 text-xs mt-2">{errors.fullname}</p>
            )}
          </div>

          <div className="mb-4">
            <Label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Email
            </Label>
            <Input
              type="text"
              id="email"
              name="email"
              value={inputData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-2">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <Label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={inputData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-2">{errors.password}</p>
            )}
          </div>
          <div className="mb-6">
            <Label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="file"
            >
              Upload Profile Picture
            </Label>
            <Input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className={`w-full px-4 py-2 border ${
                errors.file ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
