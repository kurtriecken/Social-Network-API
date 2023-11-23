const { Thought, Reaction } = require('../models');

module.exports = {
    // Get all thoughts
    async getThoughts(req, res) {
        try {
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
            const thought = await Thought.create(req.body);
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
            res.json({ message: 'Thought removed successfully!' });
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Add a reaction to a thought
    async createReaction(req, res) {
        try {
            const reaction = await Reaction.create(req.body);

            if (!reaction) {
                return res.status(404).json({ message: 'Reaction not created.' })
            };

            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: reaction } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought foudn with that ID' })
            };
            res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // Remove a reaction from a thought
    async deleteReaction(req, res) {
        try {
            const thought = await thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reaction: { _id: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            };
            res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
}