import { response } from "express";
import Products from "../models/productModel.js";

//Filteringm sorting and paginating
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString }; //queryString=req.query

    //Show queries concretely on link
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    //gte:greater than or equal
    //gt:greater than
    //lt:less than
    //lte:less than or equal
    //regex: regular expression(đối với bài này cho phép mình lọc được ngay cả khi chỉ nhập vào vài kí tự)

    //console.log({queryStr});

    this.query.find(JSON.parse(queryStr));

    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy); //lưu ý là this.query = Products.find();
    } else {
      this.query = this.query.sort("-createdAt"); //cú pháp để sắp xếp giảm dần trong Graph Ql Query
    }

    return this;
  }
  paginating() {
    //Thuật toán đánh số trang trong MongoDB:
    //find() will return a cursor pointing to all documents of the collection and then for each page we skip some and consume some. Through continuous skip and limit we get pagination in MongoDB.
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 15; //trong code là tương ứng với số đối tượng
    const skip = (page - 1) * limit;

    //limit(n) sẽ trả về n trang(documents) từ con trỏ; skip(n) sẽ bỏ qua n trang(documents) từ con trỏ
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting();

      const products = await features.query;
      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const allproduct = await Products.find();
      return res.status(200).json(allproduct);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      if (!images) return res.status(400).json({ msg: "No image upload" });
      const product = await Products.findOne({ product_id });
      if (product) return res.json({ msg: "Product existed" });

      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });

      await newProduct.save();
      res.json({ msg: "Created a product" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a product" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;
      if (!images) return res.status(400).json({ msg: "No image upload" });

      await Products.findByIdAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );

      res.json({ msg: "Updated a product" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  reviewProduct: async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);

      const { userPhoto, userName, rating, comment } = req.body;

      // Create a new review object with the extracted data
      const newReview = { userPhoto, userName, rating, comment };

      product.reviews.push(newReview);
      await product.save();

      res.status(200).json({ msg: "Updated review for product", product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteCommentProduct: async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);
      const { commentId } = req.body;

      product.reviews = product.reviews.filter(
        (review) => review._id.toString() !== commentId.toString()
      );

      const updatedProduct = await product.save();
      res.status(200).json({ message: "Comment deleted", updatedProduct });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateCommentProduct: async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);
      const updatedReview = req.body;

      const commentIndex = product.reviews.findIndex(
        (review) => review._id == updatedReview.commentId
      );

      if (commentIndex === -1) {
        return res.status(404).json({ message: "Comment not found" });
      }
      product.reviews[commentIndex].rating = updatedReview.rating;
      product.reviews[commentIndex].comment = updatedReview.comment;
      await product.save();

      res.status(200).json({ message: "Comment updated", product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default productCtrl;
