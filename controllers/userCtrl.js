import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Payments from "../models/paymentModel.js";

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email }); //tìm kiếm người dùng theo email

      if (user)
        return res.status(400).json({ msg: "The email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });

      //Mã hóa mật khẩu(Pasword Encryption)-sử dụng bcrypt
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      //Save data changes in mongoDB
      await newUser.save();

      //Then create jsonwebtoken for authentication
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      //set up name refreshtoken to the value given
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 10000, //7d
      });

      res.json({ accesstoken });
      //res.json({msg:"Register Success!"});
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });

      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "The pasword is incorrect" });

      //If login success, create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      //set up name refreshtoken to the value given
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 10000, //7d
      });

      res.json({ accesstoken });

      //res.json({msg:"Login Success!"});
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email: req.body.email });
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      //set token for the duration of our link
      const secret = process.env.ACCESS_TOKEN_SECRET + user.password;
      const token = jwt.sign({ email: user.email, id: user._id }, secret, {
        expiresIn: "5m",
      });

      // const OTP = Math.floor(Math.random() * 1000000);
      const link = `http://localhost:3000/resetpassword/${user._id}/${token}`;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "quyetyeumelam@gmail.com",
          pass: "jipt kqrp vdai debh",
        },
      });

      const mailOptions = {
        from: "quyettyeumelam@gmail.com",
        to: req.body.email,
        subject: "Forgot Password and Link to Reset Password",
        text: link,
      };

      transporter.sendMail(mailOptions, async function (error, info) {
        console.log(mailOptions);
        try {
          if (error) {
            console.log(error);
            throw new Error("Failed to send email");
          } else {
            console.log("Email sent: " + info.response);
            res.status(200).send({ message: `Email sent: ${info.response}` });
          }
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Failed to send email" });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Failed to send to email" });
    }
  },
  resetPassword: async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await Users.findOne({ _id: req.params.id });
    if (!user) {
      if (!user) return res.status(400).json({ msg: "User does not exist" });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET + user.password;

    try {
      const verify = jwt.verify(req.params.token, secret);
      const encryptedPassword = await bcrypt.hash(password, 10);
      await Users.findOneAndUpdate(
        {
          _id: id,
        },
        {
          password: encryptedPassword,
        },
        {
          new: true,
        }
      );

      return res.status(200).json({ msg: "Reset password successfully", user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "User exited" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken; //lấy từ tham số name đầu tiên của res.cookie
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register" });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken }); //khi đã vào tài khoản thì chỉ cần hiển thị mỗi accesstoken
      });

      //res.json({rf_token});
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "Added to Cart" });
    } catch (err) {
      return res.status(500).json({ msg: error.message });
    }
  },
  history: async (req, res) => {
    try {
      //Bởi vì user tương ứng sẽ có thông tin product(trong cart) nên mình chỉ cần tìm thông tin người dùng theo mã id và in ra
      //ở đây trong filter tham số đầu tiên là user_id vì sau khi thanh toán trong payemntCtrl khi trả về là ở dạng user_id:_id
      const history = await Payments.find({ user_id: req.user.id });

      res.json(history);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const alluser = await Users.find();
      return res.status(200).json(alluser);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllUsersById: async (req, res) => {
    const userId = req.query.userId;
    const userIds = userId.split(",");
    userIds.forEach(async (userid) => {
      try {
        const user = await Users.findById(userid);
        res.status(200).json(user);
      } catch (error) {
        return res.status(500).json({ msg: error.message });
      }
    });
  },
  getUserById: async (req, res) => {
    try {
      const partner = await Users.findById(req.params.id);
      if (!partner)
        return res.status(400).json({ msg: "User does not exist." });

      res.status(200).json(partner);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUserSystem: async (req, res) => {
    try {
      const users = await Users.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  uploadAvatar: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const { avatar } = req.body;
      if (!avatar) return res.status(400).json({ msg: "No image upload" });

      user.avatar = avatar;

      const updatedUser = await user.save();
      return res
        .status(200)
        .json({ msg: "Uploaded Avatar", user: updatedUser });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  uploadCover: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const { coverphoto } = req.body;
      if (!coverphoto) return res.status(400).json({ msg: "No image upload" });

      user.coverphoto = coverphoto;

      const updatedUser = await user.save();
      return res
        .status(200)
        .json({ msg: "Uploaded Cover photo", user: updatedUser });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateInfo: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const { data } = req.body;

      await Users.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name: data.newName,
          phone: data.newPhone,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({ msg: "Updated user", user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updatePass: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const { data } = req.body;

      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "The pasword is incorrect" });

      const passwordHash = await bcrypt.hash(data.newpassword, 10);
      await Users.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          password: passwordHash,
        },
        {
          new: true,
        }
      );

      return res.status(200).json({ msg: "Updated user", user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateAddress: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const { data } = req.body;

      user.addresses.push(data);

      const updatedUser = await user.save();
      return res
        .status(200)
        .json({ msg: "Added User's Address", user: updatedUser });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteAddress: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const { index } = req.body;
      user.addresses = user.addresses.filter((_, key) => key !== index);

      const updatedUser = await user.save();

      return res
        .status(200)
        .json({ msg: "Deleted User's Address", user: updatedUser });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  editAddress: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const { data } = req.body;
      user.addresses[data.index] = data.value;

      const updatedUser = await user.save();

      return res
        .status(200)
        .json({ msg: "Updated User's Address", user: updatedUser });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateBelovedProducts: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const {
        productId,
        productTitle,
        productImages,
        productRating,
        productPrice,
      } = req.body.data;

      user.belovedProducts.push({
        productId: productId.toString(),
        productTitle,
        productImages,
        productRating,
        productPrice,
      });

      const updatedUser = await user.save();

      return res
        .status(200)
        .json({ msg: "Added Beloved Product", user: updatedUser });

      return res.status(200).json({ msg: "Added User's Address", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: error.message });
    }
  },
  removeBelovedProducts: async (req, res) => {
    try {
      const user = await Users.findById(req.params.userId);
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const productIndex = user.belovedProducts.findIndex(
        (product) => product.productId === req.params.productId
      );

      if (productIndex === -1) {
        return res
          .status(404)
          .send({ error: "Product not found in beloved products" });
      }

      user.belovedProducts.splice(productIndex, 1); //remove 1 element at position productIndex
      await user.save();

      return res.status(200).json({ msg: "Removed Beloved Product", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export default userCtrl;
