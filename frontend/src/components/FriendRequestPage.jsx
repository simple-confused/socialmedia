import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FriendRequestPage = () => {
  const navigate = useNavigate();

  // Mock data for friend requests
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const res = await axios.get(
          `${USER_API_END_POINT}/getallfriendrequests`,
          {
            withCredentials: true,
          }
        );
        setRequests(res.data.friendRequests);
      } catch (error) {
        console.error(error);
      }
    };
  }, []);
  const [requests, setRequests] = useState([]);

  // Handle accept friend request
  const handleAccept = (id) => {
    setRequests(requests.filter((request) => request.id !== id));
    // You can add logic to update the friend request status in the backend
    const res = axios.post(
      `${USER_API_END_POINT}/acceptfriend`,
      { id: id },
      { withCredentials: true }
    );
    console.log(`Friend request from user ${id} accepted.`);
  };

  // Handle decline friend request
  const handleDecline = (id) => {
    setRequests(requests.filter((request) => request.id !== id));
    // You can add logic to update the friend request status in the backend
    const res = axios.post(
      `${USER_API_END_POINT}/rejectfriend`,
      { id: id },
      { withCredentials: true }
    );
    console.log(`Friend request from user ${id} declined.`);
  };
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Friend Requests
      </h2>

      <div className="max-w-4xl mx-auto">
        {requests.length === 0 ? (
          <>
            <div className="text-center text-gray-600">
              No friend requests at the moment. <br />
              Send friend requests to connect with others.
              <br />
              <p
                className="cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                Click Here To add Friends
              </p>
            </div>
          </>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-4 rounded-lg shadow-lg mb-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={request.profilePicture}
                  alt={request.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-500"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {request.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {request.mutualFriends} mutual friends
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                  onClick={() => handleAccept(request.id)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                  onClick={() => handleDecline(request.id)}
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendRequestPage;
