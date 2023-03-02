require("dotenv").config();

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { join, resolve } = require("path");
const { authMiddleware } = require("./utils/auth.js");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config");

const PORT = process.env.PORT || 3001;
const app = express();

// Socket.io boiler plate code
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Change the cors origin to the link of deployed app when deployed
    methods: ['GET', 'POST'],
  }
})

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Socket.io main working code
io.on('connection', (socket) => {
  // Console log the user's socket ID when user visits the client
  console.log(`-----Client is connected with ID: ${socket.id}-----`);

  // On 'joinRoom' event
  socket.on('joinRoom', (data) => {
    socket.join(data.roomId);
    console.log(`-----${data.userName} joined room: ${data.roomId}!-----`);

  });

  // On 'sendMessage' event
  socket.on('sendMessage', (data) => {
    // Server receives the data and sends it back to the client
    io.to(data.roomId).emit('receiveMessage', data.messageSent)

  });

  // Console log when user disconnects from client
  socket.on('disconnect', () => {
    console.log(`-----Client ID ${socket.id} has disconnected!-----`);
  })

});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join("client", "build")));

  app.get("*", function (request, response) {
    response.sendFile(resolve(__dirname, "..", "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "..", "client", "build", "index.html"));
  });
}

const startApolloServer = async (typeDefs, resolvers) => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  db.once("open", () => {
    server.listen(PORT, () => { // Set to server.listen to allow socket.io connection
      console.log(`Server is listening on port ${PORT}`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${apolloServer.graphqlPath}`
      );
    });
  });
};

startApolloServer(typeDefs, resolvers);
