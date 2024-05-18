const { config } = require("dotenv");
const Fastify = require("fastify");
const allRoutes = require("./routes/playerRoutes");
const { pool } = require("./config/db");

config();

const fastify = Fastify({
  logger: true,
});

fastify.register(allRoutes, { pool });

const start = async () => {
  try {
    await fastify.listen({ port: 4000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
