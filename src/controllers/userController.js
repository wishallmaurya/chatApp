import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from '../config/generateToken.js'
export const registerController = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    if (!name) {
      return res.send({ error: `Name is require` });
    }
    if (!email) {
      return res.send({ error: `email is require` });
    }
    if (!password) {
      return res.send({ error: `password is require` });
    }

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: `Already register Please login`,
      });
    }

    //!Hashing the Password with bcrypt

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      pic,
    }).save();
    res.status(201).send({
      success: true,
      message: `user registration success`,
      user: user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).send({
        success: false,
        message: `error in Register`,
        error,
      });
      console.log(error);
  }
};

//!  Login Controller/////////////////////////////////////////////


export const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
     
      if (!email || !password) {
        return res.status(404).send({
          success: false,
          message: `Invalid email or password`,
        });
      }
      let user = await userModel.findOne({ email });
      console.log(user)

      if (!user) {
        return res.status(404).send({
          success: false,
          message: `user not found `,
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: `the password is incorrect`,
        });
      }
      res.status(200).send({
        success: true,
        message: `login successfully`,
        user: {
          name: user.name,
          email: user.email,
          pic: user.pic,
          token: generateToken(user._id),
        },
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "error while login",
        error,
      });
    }
  };


export  const allUsers = async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await userModel.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  };
  