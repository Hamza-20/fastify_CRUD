const {
  gettingData,
  updatingData,
  enteringData,
  deletingData,
  signUp,
  signIn,
  // getMe,
} = require("../controller/playerController");

const { protect } = require("../handler/authHandler");

function allRoutes(fastify, options, done) {
  fastify.get("/player", gettingData);

  fastify.post("/player", enteringData);

  fastify.put("/player/:id", updatingData);

  fastify.delete("/player/:id", deletingData);

  fastify.post("/player/signup", signUp);

  fastify.post("/player/signin", signIn);

  //fastify.get("/player/me", { preHandler: protect }, getMe);
  done();
}

module.exports = allRoutes;
