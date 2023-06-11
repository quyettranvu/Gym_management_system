import express from 'express';
import categoryCtrl from '../controllers/categoryCtrl.js';
import auth from '../middleware/auth.js';
import authAdmin from '../middleware/authAdmin.js';

const router=express.Router();
router.route('/category')
    .get(categoryCtrl.getCategories)
    .post(auth,authAdmin,categoryCtrl.createCategory)

//Add another route to solve with category
router.route('/category/:id')
    .delete(auth,authAdmin,categoryCtrl.deleteCategory)
    .put(auth,authAdmin,categoryCtrl.updateCategory)

export default router;