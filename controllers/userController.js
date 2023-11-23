const { User, Thought } = require('../models');

module.exports = {
    // Get all users
    async getUsers(req, res) {
        try {
            const users = await User.find()
            .populate('thoughts')
            .populate('friends')
            .select('-__v');

            res.json(users);
        } catch (err) {
            return res.status(500).err;
        }
    },

    // Get a single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({
                _id: req.params.userId
            })
                .populate('thoughts')
                .populate('friends')
                .select('-__v');
                // .populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }
            res.json(user);
        } catch (err) {
            return res.status(500).err;
        }
    },

    // Create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Update a user
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }
            res.json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Delete a user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({
                _id: req.params.userId
            });

            const thought = '';
            user.thoughts.forEach(async thought => {
                thought = await Thought.findOneAndDelete(
                    {_id: thought._id.toString()}
                )
            });


            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            };
            res.json({ message: 'User removed successfully!' });
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Add a friend to a user
    async createFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user and/or friend with that ID' })
            };
            res.json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Remove a friend from a user
    async deleteFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user and/or friend with that ID' })
            };
            res.json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
}