import React, { useEffect, useState } from "react";
import FriendSuggestionScroll from "./FriendSuggestionScroll";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Button } from "./ui/button";

const DashboardPage = () => {
  const [loggedUser, setLoggedUser] = useState({});

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
  console.log(loggedUser);

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    axios
      .get(`${USER_API_END_POINT}/recent-activity`, { withCredentials: true })
      .then((response) => {
        setRecentActivity(response.data.recentActivity);
      })
      .catch((error) => {
        // console.error(error);
        toast.error("Something went wrong");
      });
  }, []);
  // console.log(recentActivity);
  // const recentActivit = [
  //   {
  //     message: "You sent a friend request to Aryan Chaturvedi.",
  //   },
  //   {
  //     message: "You sent a friend request to Ayush Chaturvedi.",
  //   },
  //   {
  //     message: "You sent a friend request to Anshi Chaturvedi.",
  //   },
  // ];
  const logout = () => {
    axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <section className="bg-white  rounded-lg shadow-lg p-6 mb-10 max-w-4xl mx-auto flex items-center space-x-6 justify-center">
        <img
          src={loggedUser.file}
          alt={loggedUser.fullname}
          className="  h-24 border-4 border-blue-500"
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {loggedUser.fullname}
          </h1>
          <p className="text-gray-600 text-sm">{loggedUser.email}</p>
        </div>
        <div>
          <Button
            className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            onClick={() => navigate("/update-profile")}
          >
            Edit Profile
          </Button>
        </div>
        <div>
          <Button
            className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            onClick={() => navigate("/friend-request")}
          >
            Friend Request
          </Button>
        </div>
        <div>
          <Button
            className="bg-red-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </section>

      <FriendSuggestionScroll />

      <section className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-gray-800">{activity}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
