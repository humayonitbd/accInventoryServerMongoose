const Product = require('../models/Product');
const { getProductsService, createProductService, updateProductService, bulkUpdateProductService, deleteProductByIdService, bulkDeleteProductService } = require("../services/product.services");



exports.getProducts = async(req, res)=>{
    try {
        // console.log(req.query)
        let queryFilters = {...req.query};
       
        const excludeFields = ["sort", "page", "limit"]
        excludeFields.forEach(field => delete queryFilters[field])
        
        //gt, lt, gte, lte
        // http://localhost:5000/api/v1/product?price[gt]=100
        let queryFiltersString = JSON.stringify(queryFilters);
       queryFiltersString = queryFiltersString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        queryFilters = JSON.parse(queryFiltersString);



        // http://localhost:5000/api/v1/product?sort=price,quantity
        const queries = {};
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            queries.sortBy=sortBy;
            console.log(sortBy);
        }

        // http://localhost:5000/api/v1/product?sort=-price,quantity&fields=name,description
        //kono data nah lagle -dataName example : down see
        // http://localhost:5000/api/v1/product?sort=-price,quantity&fields=name,description,-_id
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(" ");
            queries.fields=fields;
             console.log(fields);
        }

// http://localhost:5000/api/v1/product?page=2&limit=5
        if(req.query.page){
            const {page=1, limit=10} = req.query;

            const skip = (page-1)*parseInt(limit);
            queries.skip=skip;
            queries.limit=parseInt(limit);



        }





        const products = await getProductsService(queryFilters, queries);
        res.status(200).json({
            status: "success",
            data: products
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to insert data",
            error: error.message // You can include the error message for debugging
        });
    }
}


exports.createProduct = async (req, res, next) => {
    try {
        //save method
        const product = await createProductService(req.body);
        product.logger();
        //create method
        // const result = await Product.create(req.body);
        res.status(200).json({
            status: "success",
            message: "Data inserted successfully!!"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to insert data",
            error: error.message // You can include the error message for debugging
        });
    }
}



exports.updateProduct = async(req, res, next)=>{
    try {
        const { id } = req.params;
       const result = await updateProductService(id, req.body)
        res.status(200).json({
            status: "success",
            message: "Data update successfully!!"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Counldn't  update the product!",
            error: error.message // You can include the error message for debugging
        });
        
    }
}

exports.bulkUpdate = async(req, res, next)=>{
    try {
       const result = await bulkUpdateProductService(req.body)
        res.status(200).json({
            status: "success",
            message: "Data update successfully!!"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Counldn't  update the product!",
            error: error.message // You can include the error message for debugging
        });
        
    }
}

exports.deleteProductById = async(req, res, next)=>{
    try {
         const { id } = req.params;
       const result = await deleteProductByIdService(id);
       if(!result.deletedCount){
        return res.status(400).json({
            status:"Fail",
            message:"Couldn't delete the product"
        })

       }
        res.status(200).json({
            status: "success",
            message: "Data deleted successfully!!"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Counldn't  deleted the product!",
            error: error.message // You can include the error message for debugging
        });
        
    }
}


exports.bulkDeleteProduct = async(req, res, next)=>{
    try {
        // console.log(req.body, req.body.ids)
       const result = await bulkDeleteProductService(req.body.ids);
        res.status(200).json({
            status: "success",
            message: "Data delteed successfully!!"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Counldn't  deleted the product!",
            error: error.message // You can include the error message for debugging
        });
        
    }
}
