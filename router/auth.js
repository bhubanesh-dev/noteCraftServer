const express = require("express");
const router = express.Router();

const UserModel = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/Authenticate");

//ROUTE 1: get logged in  using: POST "/auth/register". register  process
//Using async await
router.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  if (!name || !email || !password) {
    return res.status(422).json({ error: "plz fill the filed properly" });
  } else if (password.length <= 5) {
    return res
      .status(422)
      .json({ error: "password length must be greater then 6 charecter" });
  } else {
    try {
      const response = await UserModel.findOne({ email: email });

      if (response) {
        return res.status(422).json({ error: "email already exist" });
      }

      const user = new UserModel({
        name,
        email,
        password,
      });

      await user.save();
      res.status(201).json({ msg: "you are registered successfully" });
    } catch (err) {
      //console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
});

//ROUTE 2: get logged in  using: POST "/auth/ogin". login process
router.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  //check for empty fields
  if (!email || !password) {
    return res.status(422).json({ error: "plz fill the field properly" });
  }
  try {
    const userLogin = await UserModel.findOne({ email: email });
    if (userLogin) {
      isMatch = await bcrypt.compare(password, userLogin.password);
      const userId = {
        userLogin: {
          id: userLogin.id,
        },
      };
      //generating auth token
      const token = jwt.sign(userId, process.env.SECRET_KEY);
      //geting user info and send to user
      const { _id, name, email, date } = userLogin;
      const userInfo = { _id, name, email, date };
      console.log("userinfo", userInfo);

      if (!isMatch) {
        return res.status(403).json("invalid credentials");
      } else {
        res
          .status(200)
          .json({
            msg: "user sign in successfully",
            data: userInfo,
            token: token,
          });
      }
    } else {
      return res.status(403).json({ error: "invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3: Get logged in User Details using: GET "/auth/getuser". Login required
router.get("/auth/getuser", authenticate, async (req, res) => {
  try {
    userId = req.verifyId;

    const userData = await UserModel.findById(userId)
      .select("-password")
      .select("-messages");

    res.send(userData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
// ROUTE 4: Post the user message using: POST "/auth/message". Login required
router.post("/auth/message", authenticate, async (req, res) => {
  try {
    userId = req.verifyId;
    const { message } = req.body;
    if (!message) {
      return res.status(422).json({ error: "plz fill the filed properly" });
    }

    const userData = await UserModel.findById(userId).select("-password");

    userData.messages = userData.messages.concat({ message });
    await UserModel.findByIdAndUpdate(
      userId,
      { messages: userData.messages },
      { new: true }
    );

    res.status(201).send({ message: "success" });
  } catch (error) {
    //console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
