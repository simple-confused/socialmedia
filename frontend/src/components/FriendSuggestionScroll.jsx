import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const FriendSuggestionScroll = () => {
  const [suggestions, setSuggestions] = useState([{}]);

  const [isRequested, setIsRequested] = useState([false]);
  const handleFriendRequest = (id) => {
    const data = {
      friendId: id,
    };
    // console.log(id);

    axios
      .post(`${USER_API_END_POINT}/addfriend`, data, {
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data);
        setSuggestions(
          suggestions.filter((suggestion) => suggestion._id !== id)
        );
        toast.success("Friend Request Sent");
        return response.data.success;
      })
      .catch((error) => {
        // console.error(error);
        toast.error(error.response.data.message);
      });
    axios
      .post(
        `${USER_API_END_POINT}/request`,
        data,

        {
          withCredentials: true,
        }
      )
      .then((response) => {
        // console.log(response.data);
        // setIsRequested(response.data.success);
        return response.data.success;
      });
  };
  useEffect(() => {
    axios
      .get(`${USER_API_END_POINT}/suggestions`, { withCredentials: true })
      .then((response) => {
        setSuggestions(response.data.friends);
        // console.log(response.data);
      })
      .catch((error) => {
        // console.error(error);
        toast.error("Something went wrong");
      });
  }, []);
  // console.log(suggestions);

  const suggestio = [
    {
      id: 1,
      name: "John Doe",
      mutualFriends: 3,
      profilePicture: "https://via.placeholder.com/50",
      isRequested: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      mutualFriends: 1,

      profilePicture: "https://via.placeholder.com/50",
      isRequested: true,
    },
    {
      id: 3,
      name: "Sam Wilson",
      mutualFriends: 5,
      profilePicture: "https://via.placeholder.com/50",
      isRequested: true,
    },
    {
      id: 4,
      name: "Emma Watson",
      mutualFriends: 2,
      profilePicture: "https://via.placeholder.com/50",
      isRequested: true,
    },
    {
      id: 5,
      name: "Chris Evans",
      mutualFriends: 4,
      profilePicture: "https://via.placeholder.com/50",
      isRequested: true,
    },
  ];

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Friend Suggestions
      </h2>

      {/* Horizontal Scroll Container */}
      <div className="flex space-x-4 overflow-x-scroll no-scrollbar p-2">
        {suggestions.map((suggestion) => {
          // console.log(isRequested);
          return (
            <div
              key={Math.random()}
              className="bg-white p-4 rounded-lg shadow-lg flex-shrink-0 w-48 text-center"
            >
              <img
                src={suggestion.file}
                alt={suggestion.fullnamename}
                className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-blue-500"
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {suggestion.fullname}
              </h3>

              <button
                className={`py-2 px-6 rounded-lg font-semibold transition duration-300 
                
                    ${
                      isRequested
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }
                  suggestion.fullname
                

                `}
                onClick={() => handleFriendRequest(suggestion._id)}
                disabled={suggestion.isRequested}
              >
                {suggestion.isRequested ? "Request Sent" : "Add Friend"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendSuggestionScroll;
