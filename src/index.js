"use strict";
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {},
  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi } */) {
    //strapi.server.httpServer is the new update for Strapi V4
    var io = require("socket.io")(strapi.server.httpServer, {
      cors: {
        // cors setup
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
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
  },
};
