import mongoose from "mongoose";

const UserchatsSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    chats: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,  // Changed to ObjectId for MongoDB compatibility
                required: true
            },
            title: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now  // Corrected default value
            }
        }
    ]
}, { timestamps: true });

export default mongoose.models.Userchats || mongoose.model("Userchats", UserchatsSchema); // Ensure the model name is consistent
