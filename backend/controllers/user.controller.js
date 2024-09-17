import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email",
        success: false,
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and at least 6 characters",
        success: false,
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false,
      });
    }

    const file = req.file;
    console.log(file);
    if (!file) {
      return res.status(500).json({ message: "Upload Profile Picture" });
    }
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // const isVerified = false;
    // const verifyToken = Math.floor(100000 + Math.random() * 900000);

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      file: cloudResponse.secure_url,
      // isVerified,
      // verifyToken,
    });
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        message: "Logged in successfully.",
        success: true,
        token,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.cookies.token) {
      return res.status(400).json({
        message: "User not logged in",
        success: false,
      });
    }
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { verifyToken } = req.body;
    const { id } = req.params;
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (user.isVerified) {
      return res.status(400).json({
        message: "Account already verified",
        success: false,
      });
    }
    if (user.verifyToken !== verifyToken) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
      });
    }
    user.isVerified = true;
    user.verifyToken = "";
    await user.save();
    return res.status(200).json({
      message: "Account verified successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendVerificationMail = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (user.isVerified) {
      return res.status(400).json({
        message: "Account already verified",
        success: false,
      });
    }
    const verify = user.verifyToken;
    // TODO SEND EMAIL
    // const verify = "123456";
    const emailresponse = await sendVerificationEmail(email, verify);
    if (!emailresponse) {
      return res.status(500).json({
        message: "Email not sent",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Verification email sent successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addFriend = async (req, res) => {
  try {
    const id = req.id;
    const { friendId } = req.body;
    let user = await User.findById(id);
    let friend = await User.findById(friendId);

    if (!user) {
      return res.status(404).json({
        message: "User nhai not found",
        success: false,
      });
    }
    if (!friend) {
      return res.status(404).json({
        message: "Friend not found",
        success: false,
      });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({
        message: "Already friends",
        success: false,
      });
    }
    if (user.sentRequests.includes(friendId)) {
      return res.status(400).json({
        message: "Request already sent",
        success: false,
      });
    }
    if (user.friendRequests.includes(friendId)) {
      return res.status(400).json({
        message: "Accept friend request",
        success: false,
      });
    }
    user.sentRequests.push(friendId);
    friend.friendRequests.push(id);
    await user.save();
    await friend.save();
    return res.status(200).json({
      message: "Friend request sent",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const id = req.id;
    const { friendId } = req.body;
    let user = await User.findById(id);
    let friend = await User.findById(friendId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (!friend) {
      return res.status(404).json({
        message: "Friend not found",
        success: false,
      });
    }

    if (!user.friendRequests.includes(friendId)) {
      return res.status(400).json({
        message: "No friend request",
        success: false,
      });
    }
    if (user.friends.includes(friendId)) {
      return res.status(400).json({
        message: "Already friends",
        success: false,
      });
    }
    user.friendRequests = user.friendRequests.filter(
      (request) => request != friendId
    );
    friend.sentRequests = friend.sentRequests.filter(
      (request) => request != id
    );
    user.friends.push(friendId);
    friend.friends.push(id);
    await user.save();
    await friend.save();
    return res.status(200).json({
      message: "Friend request accepted",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllfriendRequests = async (req, res) => {
  try {
    const id = req.id;
    let user = await User.findById(id).populate("friendRequests");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Friend requests",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.id;
    let user = await User.findById(id).populate(
      "friends friendRequests sentRequests"
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "User",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const id = req.id;
    let user = await User.findById(id).populate("friends");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Friends",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const id = req.id;
    const { friendId } = req.body;
    let user = await User.findById(id);
    let friend = await User.findById(friendId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (!friend) {
      return res.status(404).json({
        message: "Friend not found",
        success: false,
      });
    }
    if (!user.friendRequests.includes(friendId)) {
      return res.status(400).json({
        message: "No friend request",
        success: false,
      });
    }
    user.friendRequests = user.friendRequests.filter(
      (request) => request != friendId
    );
    friend.sentRequests = friend.sentRequests.filter(
      (request) => request != id
    );
    await user.save();
    await friend.save();
    return res.status(200).json({
      message: "Friend request rejected",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const mutualFriends = async (req, res) => {
  try {
    const id = req.id;
    const { friendId } = req.body;
    let user = await User.findById(id).populate("friends");
    let friend = await User.findById(friendId).populate("friends");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (!friend) {
      return res.status(404).json({
        message: "Friend not found",
        success: false,
      });
    }
    let mutualFriends = user.friends.filter((friend) =>
      friend.friends.includes(friendId)
    );
    const numberOfMutualFriends = mutualFriends.length;
    return res.status(200).json({
      message: "Mutual Friends",
      success: true,
      numberOfMutualFriends,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const recentActivity = async (req, res) => {
  try {
    const id = req.id;
    let user = await User.findById(id).populate(
      "sentRequests friends friendRequests"
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    let recentActivity = [];
    user.sentRequests.forEach((friend) => {
      recentActivity.push(` You sent a friend request to ${friend.fullname}`);
    });
    user.friendRequests.forEach((friend) => {
      recentActivity.push(`${friend.fullname} sent a friend request to you`);
    });
    user.friends.forEach((friend) => {
      recentActivity.push(`${friend.fullname} is now friends with you`);
    });

    return res.status(200).json({
      message: "Recent Activity",
      success: true,
      recentActivity,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const id = req.id;
    const { fullname, bio } = req.body;
    const file = req.file;
    // console.log(file);
    // if (!file) {
    //   return res.status(500).json({ message: "Upload Profile Picture" });
    // }
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

      let user = await User.findByIdAndUpdate(
        id,
        { fullname, bio, file: cloudResponse.secure_url },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }
    }

    let user = await User.findByIdAndUpdate(
      id,
      { fullname, bio },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const suggestFriends = async (req, res) => {
  try {
    const id = req.id;
    let user = await User.findById(id).populate(
      "friends sentRequests friendRequests"
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    let friends = await User.find({
      _id: {
        $nin: user.sentRequests,
      },
    });
    return res.status(200).json({
      message: "Suggested Friends",
      success: true,
      friends,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const isRequested = async (req, res) => {
  try {
    const id = req.id;
    const { friendId } = req.body;
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (user.sentRequests.includes(friendId)) {
      return res.status(200).json({
        message: "Request sent",
        success: true,
      });
    }
    return res.status(200).json({
      message: "Request not sent",
      success: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
