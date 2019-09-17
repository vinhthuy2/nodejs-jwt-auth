const router = require("express").Router();
const verify = require("../routes/verifyToken");
const User = require("../model/User");
router.get("/", verify, async (req, res) => {
  //   res.json({ post: { title: "my first post" } });
  const user = await User.findOne({ _id: req.user._id });
  res.json(user);
});

module.exports = router;
