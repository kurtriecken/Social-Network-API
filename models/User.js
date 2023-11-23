const { Schema, model, Types } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "Please provide a username"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            validate: {
                validator: function (email) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
                },
                message: "Please enter a valid email"
            },
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            }
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;