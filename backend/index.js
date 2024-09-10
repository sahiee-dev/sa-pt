import dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import ImageKit from 'imagekit';
import mongoose from 'mongoose';
import Userchats from './models/userChats.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import Chat from './models/chat.js';

const port = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
console.log("Serving static files from:", path.join(__dirname, "/client/dist/index.html"));

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));

app.use(express.json());

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

// Ensure required environment variables are set
if (!process.env.IMAGE_KIT_ENDPOINT || !process.env.IMAGE_KIT_PUBLICKEY || !process.env.IMAGE_KIT_PRIVATEKEY) {
    console.error('Missing ImageKit configuration in environment variables');
    process.exit(1);
}

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLICKEY,
    privateKey: process.env.IMAGE_KIT_PRIVATEKEY
});

// Root route - simple response for the base URL


app.get('/api/upload', (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

app.post('/api/chats',
    ClerkExpressRequireAuth(),
    async (req, res) => {
        const userId = req.auth.userId;
        const { text } = req.body;
        try {
            // Create a new chat
            const newChat = new Chat({
                userID: userId,
                history: [{ role: "user", parts: [{ text }] }],
            });
            const savedChat = await newChat.save();

            // Check if the user chats exist
            const existingUserChats = await Userchats.findOne({ userID: userId });

            if (!existingUserChats) {
                // Create new UserChats if it doesn't exist
                const newUserChats = new Userchats({
                    userID: userId,
                    chats: [
                        {
                            _id: savedChat._id,
                            title: text.substring(0, 40)
                        }
                    ]
                });
                await newUserChats.save();
            } else {
                // Update existing UserChats
                await Userchats.updateOne(
                    { userID: userId },
                    {
                        $push: {
                            chats: {
                                _id: savedChat._id,
                                title: text.substring(0, 40)
                            }
                        }
                    }
                );
            }

            res.status(200).json({ _id: savedChat._id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error creating chat" });
        }
    });

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    try {
        const userChats = await Userchats.findOne({ userID: userId });
        if (!userChats) {
            return res.status(404).json({ error: "User chats not found" });
        }
        res.status(200).json(userChats.chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching user chats" });
    }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    try {
        const chat = await Chat.findOne({ _id: req.params.id, userID: userId });
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        res.status(200).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching chat" });
    }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    const { question, answer, img } = req.body;

    const newItems = [
        ...(question ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
            : []),
        { role: "model", parts: [{ text: answer }] },
    ];

    try {
        const updatedChat = await Chat.findOneAndUpdate(
            { _id: req.params.id, userID: userId },
            {
                $push: {
                    history: {
                        $each: newItems,
                    }
                }
            },
            { new: true }
        );

        if (!updatedChat) {
            return res.status(404).json({ error: "Chat not found or not updated" });
        }

        res.status(200).json(updatedChat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error adding conversation" });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).json({ error: 'Unauthenticated!' });
});

// Serve static files
app.use(express.static(path.join(__dirname, "/client/dist")));

// Handle client-side routing
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

connect().then(() => {
    app.listen(port, () => {
        console.log(`The server is running on port ${port}`);
    });
}).catch(err => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
});