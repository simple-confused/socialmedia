import React from "react";
import { Link } from "react-router-dom";
const HeroSection = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <section className="text-center px-6 py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white w-full">
        <h1 className="text-5xl font-bold mb-6">
          Connect with Friends, Share Moments
        </h1>
        <p className="text-lg mb-8">
          Join our social network to stay connected with friends, share updates,
          and build your community.
        </p>
        <p className="text-sm mb-8">
          (This is a demo website created using MERN stack and Tailwind CSS for
          assignment purpose for company:-Tutedude)
        </p>
        <div>
          <Link
            to="/register"
            className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-800 transition duration-300 mx-2 "
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300 mx-2"
          >
            Log In
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white w-full text-center">
        <h2 className="text-4xl font-bold mb-10 text-gray-800">Why Join Us?</h2>
        <div className="flex justify-center space-x-8 max-w-5xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-1/3 hover:shadow-2xl transition duration-300">
            <img
              src="https://img.icons8.com/fluent/96/000000/handshake.png"
              alt="Connect with Friends"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Connect with Friends</h3>
            <p className="text-gray-600">
              Add your friends and stay updated with their latest moments and
              life events.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-1/3 hover:shadow-2xl transition duration-300">
            <img
              src="https://img.icons8.com/fluent/96/000000/share.png"
              alt="Share Moments"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Share Your Life</h3>
            <p className="text-gray-600">
              Post your photos, videos, and thoughts for others to engage with
              and enjoy.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-1/3 hover:shadow-2xl transition duration-300">
            <img
              src="https://img.icons8.com/fluent/96/000000/community-grants.png"
              alt="Build Community"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Build a Community</h3>
            <p className="text-gray-600">
              Engage with others, join groups, and expand your personal network.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 w-full text-center">
        <h2 className="text-4xl font-bold mb-8 text-gray-800">
          Join the Network Now
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          Whether you want to stay connected with friends or build new
          relationships, our platform is the place to be.
        </p>
        <Link
          to="/register"
          className="bg-blue-600 text-white font-semibold py-3 px-10 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Create an Account
        </Link>
      </section>
    </div>
  );
};

export default HeroSection;
