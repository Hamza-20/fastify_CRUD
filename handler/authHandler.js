const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const { pool } = require("../config/db");

config();

const protect = async (req, rep, next) => {
  let token; // Declare token variable

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    try {
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get user from the token
      const userResult = await pool.query(
        `SELECT id, name, email
          FROM curd_db
          WHERE id = $1`,
        [decoded.id]
      );

      if (userResult.rows.length > 0) {
        req.user = userResult.rows[0]; // Assign user to req.user
        return next(); // Call next to proceed to the next handler
      }
    } catch (err) {
      rep.status(401);
      throw new Error("Not authorized");
    }

  if (!token) {
    rep.status(401);
    throw new Error("Not authorized, no token");
  }

  next(); // Call next to proceed to the next handler
};

module.exports = { protect };
