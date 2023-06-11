import Message from "../models/messageModel.js";

const conversationCtrl = {
  createMessage: async (req, res) => {
    try {
      const newMessage = new Message(req.body);

      const savedMessage = await newMessage.save();
      res.status(200).json({ msg: "Create message", savedMessage });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getMessages: async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });

      res.status(200).json({ msg: "Get message", messages });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

export default conversationCtrl;
