const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validations = require("../validation");

router.post("/register", async (req, res) => {
  // LETS VALIDATE THE DATA BEFORE MAKE A USER
  const { error } = validations.registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // checking if the user is already in the db
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // hash password
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  console.log(hashedPassword);
  console.log(await bcrypt.hash(req.body.password, "1236l"));

  // create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  // save
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = validations.loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // checking if the user is already in the db
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email does't exist");
  // PASSWORD is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  // create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);

  // res.send("Logged in");
});

module.exports = router;
