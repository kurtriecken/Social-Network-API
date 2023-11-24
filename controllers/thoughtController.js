const { Thought, User } = require('../models');

module.exports = {
    // Get all thoughts
    async getThoughts(req, res) {
        try {
            console.trace('trying to get all thoughts');
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            return res.status(500).err;
        }
    },

    // Get a single thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({
                _id: req.params.thoughtId
            })
                .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            }
            res.json(thought);
        } catch (err) {
            return res.status(500).err;
        }
    },

    // Create a new thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create({
                thoughtText: req.body.thoughtText,
                username: req.body.username
            });

            console.trace(thought.id);

            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought.id } },
                { runValidators: true, new: true }
            );

            console.trace(user);

            res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Update a thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            }
            res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove({
                _id: req.params.thoughtId
            });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            };
            res.json({ message: 'Thought removed successfully.' });
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Add a reaction to a thought
    async createReaction(req, res) {
        try {
            console.trace(req.body);

            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' })
            };
            res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Remove a reaction from a thought
    async deleteReaction(req, res) {
        try {
            console.trace(req.params.thoughtId);
            console.trace(req.params.reactionId);
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            };
            res.json({ message: 'Reaction removed from thought successfully.' });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
}