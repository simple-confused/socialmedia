import express from "express";
import {
  acceptFriendRequest,
  addFriend,
  getAllfriendRequests,
  getAllFriends,
  getUser,
  isRequested,
  login,
  logout,
  mutualFriends,
  recentActivity,
  register,
  rejectFriendRequest,
  sendVerificationMail,
  suggestFriends,
  updateProfile,
  verifyUser,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();

router.route("/user").get(isAuthenticated, getUser);
router.route("/register").post(singleUpload, register);

router.route("/verify/:id").post(verifyUser);
router.route("/send-verification-mail").post(sendVerificationMail);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/addfriend").post(isAuthenticated, addFriend);
router.route("/acceptfriend").post(isAuthenticated, acceptFriendRequest);
router
  .route("/getallfriendrequests")
  .get(isAuthenticated, getAllfriendRequests);
router.route("/getallfriends").get(isAuthenticated, getAllFriends);
router.route("/rejectfriend").post(isAuthenticated, rejectFriendRequest);
router.route("/suggestions").get(isAuthenticated, suggestFriends);
router.route("/recent-activity").get(isAuthenticated, recentActivity);
router.route("/mutual-friends").post(isAuthenticated, mutualFriends);
router.route("/request").post(isAuthenticated, isRequested);
export default router;
