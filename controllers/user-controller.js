const { User, Thought } = require("../models");

const userController = {
    // get all
    getAllUser(req, res) {
        User.find({})
            .populate({
                path: "friends",
                select: "-__v",
            })
            .select("-__v")
            .sort({ _id: -1 })
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.sendStatus(400).json(err);
            });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: "thoughts",
                select: "-__v",
            })
            .populate({
                path: "friends",
                select: "-__v",
            })
            .select("-__v")
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: "No user found with this id!" });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.json(err);
            });
    },

    // create new u__
    createUser({ body }, res) {
        User.create(body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.json(err));
    },


    // by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with this id!" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },

    // delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: "No user with this id!" });
                }
                // BONUS: Remove a user's associated thoughts when deleted.
                return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
            })
            .then(() => {
                res.json({ message: "User and all thoughts are now Deleted!!!" });
            })
            .catch((err) => res.json(err));
    },

    // add friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with this id" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },

    // delete friend
    removeFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId } }, { new: true })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: "No user found with this id!" });
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },
};
module.exports = userController;
