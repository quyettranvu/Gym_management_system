import Delivery from "../models/deliveryModel.js";

const deliveryCtrl = {
  getDeliveries: async (req, res) => {
    try {
      const deliveries = await Delivery.find();
      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  createDelivery: async (req, res) => {
    try {
      const { serviceName, description } = req.body;
      const delivery = await Delivery.findOne({ serviceName });
      if (delivery)
        return res.status(400).json({ msg: "This delivery already existed." });

      const newDelivery = new Delivery({ serviceName, description });

      await newDelivery.save();
      res.json({ msg: "Created a Service Delivery", newDelivery });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteDelivery: async (req, res) => {
    try {
      await Delivery.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a service Delivery" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateDelivery: async (req, res) => {
    try {
      const { serviceName, description } = req.body.data;
      await Delivery.findOneAndUpdate(
        { _id: req.params.id },
        { serviceName, description }
      );

      res.json({ msg: "Updated a Service Delivery" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateIDDelivery: async (req, res) => {
    try {
      const serviceId = req.params.id;
      const paymentId = req.body.paymentId;

      // Find the delivery service by ID
      const deliveryService = await Delivery.findById(serviceId);

      // Update the payment ID for the service
      deliveryService.paymentID.push(paymentId);

      // Save the updated service
      await deliveryService.save();

      res
        .status(200)
        .json({
          message: "Delivery service updated successfully",
          deliveryService,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default deliveryCtrl;
