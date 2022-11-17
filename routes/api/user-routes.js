const router = require("express").Router();
// prettier-ignore
const { 
  getAllUser, getUserById, createUser, updateUser, deleteUser, addFriend, removeFriend,} = require("../../controllers/user-controller");

router.route("/").get(getAllUser).post(createUser);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = router;
