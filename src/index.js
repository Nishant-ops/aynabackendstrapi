"use strict";
const startSocketServer = require("../src/api/message/ws/message");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Use Strapi's existing HTTP server to start the Socket.IO server
    const server = strapi.server.httpServer;

    // Start the Socket.IO server
    startSocketServer(server);

    console.log(`Server is running on port ${process.env.PORT || 1337}`);
  },
};
