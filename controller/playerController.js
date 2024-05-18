//const fastify = require("fastify");

const { pool } = require("../config/db");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();


//GET

const gettingData = async function (request, reply) {
  //fastify.pg.connect(onConnect);

  try {
    console.log("check");
    const result = await pool.query("Select * From curd_db");
    console.log(result);
    reply.send(result.rows);
  } catch (err) {
    reply.status(500).send({ error: err.message });
    console.log(err);
  }
};

//POST
const enteringData = async function (request, reply) {
  console.log("check");
  try {
    const { id, name, age } = request.body;

    const result = await pool.query(
      `INSERT INTO curd_db(id,name,age) VALUES ($1,$2,$3) RETURNING*`,
      [id, name, age]
    );

    reply.send(result.rows);
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};

//PUT
const updatingData = async (request, reply) => {
  try {
    const { id } = request.params;
    const { name, age } = request.body;

    const result = await pool.query(
      `
              UPDATE curd_db
              SET name = $1, age = $2
              WHERE id = $3
            `,
      [name, age, id]
    );

    reply.send(result.rows);
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};

//DELETE

const deletingData = async (request, reply) => {
  console.log("deleting");
  const { id } = request.params;
  try {
    const result = await pool.query(`DELETE From curd_db WHERE id = $1`, [id]);

    reply.send(result.rows);
  } catch (err) {
    // console.log(err);
    reply.status(500).send({ error: err.message });
  }
};

//@desc Registering new User
//@route POST /signup

const signUp = async (req, rep) => {
  try {
    console.log("signUppppppp");
    const { id, name, email, password } = req.body;

    if (!name || !email || !password) {
      rep.status(400).send({ error: "Add all fields" });
    }

    //checking if user already exists
    const userExists = await pool.query(
      `SELECT * FROM curd_db WHERE email = $1`,
      [email]
    );

    if (userExists.rows.length) {
      return rep.status(400).send({ error: "User already exists" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //createUser
    const user = await pool.query(
      "INSERT INTO curd_db (id,name, email, password) VALUES ($1, $2, $3,$4) RETURNING *",
      [id, name, email, hashedPassword]
    );

    if (user) {
      rep.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      return rep.status(400).send({ error: "Invalid user data" });
    }
  } catch (err) {
    return rep.status(500).send({ error: err.message });
  }
};

//@desc Registering new User
//@route POST /signin

const signIn = async (req, rep) => {
  try {
    const { email, password } = req.body;

    // finding user by email
    const userFind = await pool.query(
      `SELECT * FROM curd_db WHERE email = $1`,
      [email]
    );

    console.log(userFind);
    if (
      userFind.rows.length > 0 &&
      (await bcrypt.compare(password, userFind.rows[0].password))
    ) {
      rep.status(200).send({
        id: userFind.rows[0].id,
        name: userFind.rows[0].name,
        email: userFind.rows[0].email,
        token: generateToken(userFind.id),
      });
    } else {
      rep.status(400).send({ error: "Invalid credentials" });
    }
  } catch (err) {
    rep.status(500).send({ error: err.message });
  }
};

//JWT TOKEN

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//GET getme
//private

/* const getMe = async (req, res) => {
  rep.send({ message: "display user" });
};
 */

module.exports = {
  gettingData,
  updatingData,
  enteringData,
  deletingData,
  signUp,
  signIn,
  //getMe,
};
