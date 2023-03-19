const UserSchema = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ---------------------------- //create Account ---------------------------- */

const createController = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ phone: req.body.phone });
    if (user) {
      res
        .status(409)
        .json({ message: "user with this phone number already exist!" });
    } else {
      const password = await bcrypt.hash(req.body.password, 10);
      const userDetails = new UserSchema({
        name: req.body.name,
        phone: req.body.phone,
        password: password,
      });
      await userDetails.save();
      res.status(200).json({ message: "your account created successfully" });
    }
  } catch (error) {
    console.log(error, "error create");
    res.status(500).json(error.message);
  }
};

/* ---------------------- Function to generate a tokens ---------------------- */

const generateAccessToken = (user) => {
  return jwt.sign({ id: user }, process.env.JWTSECRET, { expiresIn: "30s" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user }, process.env.JWT_REFRESHSECRET);
};

/* ------------------------- REFRESH TOKEN GENERATE ------------------------- */

const getRefreshToken = async (req, res) => {
  const refreshToken = req.body.token;
  console.log(process.env.JWT_REFRESHSECRET, "op typr");
  console.log(refreshToken, "its me refresh in body");
  if (!refreshToken) {
    return res.status(401).json({ message: "You are not authenticated!" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESHSECRET, (err, user) => {
    console.log(user);
    err && console.log(err);

    const newAccessToken = generateAccessToken(user?.id);

    res.status(200).json({ accessToken: newAccessToken });
  });
};

/* ---------------------------- Login Controller ---------------------------- */

const loginController = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await UserSchema.findOne({ phone: phone });
    if (user) {
      const pass = await bcrypt.compare(password, user.password);
      if (pass) {
        const { password, createdAt, updatedAt, ...userData } = user._doc;
        const accessToken = generateAccessToken(userData);
        const refToken = generateRefreshToken(userData);
        res.status(200).json({
          message: "logged in successfully",
          accessToken,
          refreshToken: refToken,
        });
      } else {
        res.status(401).json({ message: `password doesn't match!` });
      }
    } else {
      res.status(404).json({ message: "user not found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------------- Get User Details ---------------------------- */

const getUserDetails = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    const { password, createdAt, updatedAt, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

/* --------------------------- //update profilePic -------------------------- */

const postUpdateProfilePic = async (req, res) => {
  const { _id } = req.user;
  let image = req?.file?.filename;
  try {
    const result = await UserSchema.findByIdAndUpdate(_id, {
      $set: { profile: image },
    });
    console.log(result, "pic update");
    const { password, createdAt, updatedAt, ...userData } = result._doc;

    res
      .status(200)
      .json({
        message: "profile picture updated",
        user: { ...userData, profile: image },
      });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

/* ----------------------------- //Search Users ----------------------------- */

const searchUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserSchema.find(
      { phone: { $regex: "^" + id }, _id: { $ne: req.user._id } },
      { name: 1, phone: 1, profile: 1 }
    );
    res.status(200).json({ users: user });
  } catch (error) {
    res.status(500).json(error?.message);
  }
};

/* ------------------------- //Update online status ------------------------- */

const updateOnlineStatus = async (req, res) => {
  console.log(req.body, "online status update route called");
  const time = Date.now();
  try {
    const result = await UserSchema.updateOne(
      { _id: req.body.id },
      { $set: { online: time } }
    );
    res.status(200).json({ message: "updated" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createController,
  loginController,
  getRefreshToken,
  getUserDetails,
  updateOnlineStatus,
  postUpdateProfilePic,
  searchUser,
};
