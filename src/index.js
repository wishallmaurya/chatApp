import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from './routes/userRoutes.js'
import chatRoute from './routes/chatRoutes.js'
import messageRoute from './routes/messageRoutes.js'
import cors from 'cors'
import { Server } from 'socket.io';

// import io from 'socket.io'


const app=express()
app.use(cors())
dotenv.config();
app.use(express.json())

//! Database 
const db= async()=>{
    try {
        await mongoose.connect(process.env.CLUSTER)
        console.log(`db is connected`);
    } catch (error) {
        console.log(`Error in mongodb${error}`);
    }
}

db();
//! Routes 

app.use('/api/v1/user',userRoute)
app.use('/api/v1/chat',chatRoute)
app.use('/api/v1/message',messageRoute)



//!Server
const server =app.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`);
})

const io = new Server(server);

 (server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageReceived) => {
      var chat = newMessageReceived.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageReceived.sender._id) return;
  
        socket.in(user._id).emit("message received", newMessageReceived);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });