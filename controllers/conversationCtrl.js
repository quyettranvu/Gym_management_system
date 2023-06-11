import Conversation from "../models/conversationModel.js";

const conversationCtrl = {
  createConversation: async (req, res) => {
    try {
      const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });

      const savedConversation = await newConversation.save();
      res.status(200).json({ msg: "Create conversation", savedConversation });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getConversations: async (req, res) => {
    try {
      const userConversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });

      res.status(200).json({ msg: "Get conversation", userConversation });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getIdConversations: async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

export default conversationCtrl;
