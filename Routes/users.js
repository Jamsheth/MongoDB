const express = require("express");

//this is importing the Json
const { users } = require("../data/users.json");

const router = express.Router();

//users API with get method
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

//users/:id API with get method
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    res.status(404).json({
      success: false,
      message: "User Id not found",
    });
  }
  return res.status(200).json({
    success: true,
    data: user,
  });
});

//user API with Post method
router.post("/", (req, res) => {
  const { id, name, surnmae, email, subscriptionType, subscriptionDate } =
    req.body;

  const user = users.find((each) => each.id === id);
  if (user) {
    res.status(404).json({
      success: false,
      message: "User already exists",
    });
  }
  users.push({
    id,
    name,
    surnmae,
    email,
    subscriptionType,
    subscriptionDate,
  });
  return res.status(202).json({
    success: true,
    data: users,
  });
});

//users/:id API with put method
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const user = users.find((each) => each.id === id);
  if (!user) {
    res.status(404).json({
      succcess: false,
      message: "User not found",
    });
  }
  const updatedUser = users.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });
  return res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

//"users/:id" API with delete method
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const index = users.indexOf(user);
  users.splice(index, 1);

  return res.status(200).json({
    success: true,
    message: users,
  });
});

//"/subscription/:id" API with get method
router.get("/subscription/:id", (res, req) => {
  const { id } = req.params;

  const user = users.find((each) => each.id === id);
  if (!user) {
    res.status(404).json({
      success: false,
      message: "Invalid user id",
    });
  }
  const getDateindays = (data = "") => {
    let date;
    if (data === "") {
      date = new Date();
    } else {
      date = new Date(data);
    }
    let days = Math.floor(date / (1000 * 60 * 60 * 24));
    return days;
  };

  const subscriptionType = (date) => {
    if (user.subscriptionType === "Basic") {
      date = date + 90;
    } else if (user.subscriptionType === "Standard") {
      date = date + 180;
    } else if (user.subscriptionType === "Premium") {
      date = date + 365;
    }
    return date;
  };

  let returnDate = getDateindays(user.returnDate);
  let currentDate = getDateindays();
  let subscriptionDate = getDateindays(user.subscriptionDate);
  let subscriptionExpiration = subscriptionType(subscriptionDate);

  const data = {
    ...user,
    subscriptionExpired: subscriptionExpiration < currentDate,
    daysLeftforExpiration:
      subscriptionExpiration <= currentDate
        ? 0
        : subscriptionExpiration - currentDate,
    fine:
      returnDate < currentDate
        ? subscriptionExpiration <= currentDate
          ? 200
          : 100
        : 0,
  };

  return res.status(200).json({
    success: true,
    data,
  });
});

module.exports = router;
