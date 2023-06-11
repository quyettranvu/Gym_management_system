import Payments from "../models/paymentModel.js";
import Users from "../models/userModel.js";
import Products from "../models/productModel.js";

const paymentCtrl = {
  getPayments: async (req, res) => {
    try {
      const payments = await Payments.find();
      res.json(payments);
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updatePayment: async (req, res) => {
    try {
      const payment = await Payments.findById(req.body.id);
      if (!payment)
        return res.status(400).json({ msg: "Payment does not exist" });

      payment.status = !payment.status;
      await payment.save();
      return res.status(200).json({ msg: "Updated payment", payment });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createPayment: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("name email");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const { cart, paymentID, address, total } = req.body;
      const { _id, name, email } = user;

      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
        cart,
        paymentID,
        address,
        total,
      });

      //Kết hợp filter và findOneAndUpdate mình sẽ cập nhật lại giá trị sold
      //Ở đây cart(từ phía userAPI.js) nên có thuộc tính quantity, thuộc tính id và sold là từ product
      cart.filter((item) => {
        return Sold(item._id, item.quantity, item.sold);
      });

      await newPayment.save();
      res.json({ msg: "Payment Success!" }); //nếu như mình muốn save lại mỗi lần thanh toán thì call: await newPayment.save();
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllPayments: async (req, res) => {
    try {
      const payments = await Payments.find();
      res.status(200).json(payments);
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deletePayment: async (req, res) => {
    try {
      const payment = await Payments.findByIdAndDelete(req.params.id);
      if (!payment)
        return res.status(400).json({ msg: "Payment does not exist" });

      const updatedPayment = await Payments.find();

      return res.status(200).json({ msg: "Deleted payment", updatedPayment });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

//Xử lý và cập nhật số lượng thanh toán
const Sold = async (id, quantity, oldSold) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      sold: quantity + oldSold,
    }
  );
};

export default paymentCtrl;
