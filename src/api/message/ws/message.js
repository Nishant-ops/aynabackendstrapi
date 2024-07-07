"use strict";
const { Server } = require("socket.io");
/**
 * message ws events
 */

module.exports = function startSocketServer(server) {
  // @ts-ignore
  var io = new Server(server, {
    cors: {
      // cors setup
      origin: ["http://localhost:5173", "https://ayna-nishant.netlify.app"],
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true,
    },
  });
  io.on("connection", function (socket) {
    //Listening for a connection from the frontend
    socket.on("join", ({ room }) => {
      // Listening for a join connections
      console.log("username is ", room);
      if (room) {
        socket.join(room); // Adding the user to the group
        socket.emit("welcome", {
          // Sending a welcome message to the User
          user: "bot",
          text: `${room}, Welcome to the group chat`,
          userData: room,
        });
      } else {
        console.log("An error occurred");
      }
    });
    socket.on("sendMessage", async (data, room) => {
      console.log(data, "-->", room);
      // Listening for a sendMessage connection

      const userMessage = await strapi.entityService.create(
        "api::message.message",
        {
          data: {
            sender_type: "USER",
            chat_room: room,
            content: data.content,
          },
        }
      );
      socket.emit("recieve-messages", { message: userMessage, room: room });
      const senderMessage = await strapi.entityService.create(
        "api::message.message",
        {
          data: {
            sender_type: "SYSTEM",
            chat_room: room,
            content: data.content,
          },
        }
      );
      socket.emit("recieve-messages", { message: senderMessage, room: room });
    });
  });
};
