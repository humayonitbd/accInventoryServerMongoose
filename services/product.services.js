const mongoose = require('mongoose');
const Product = require('../models/Product');



exports.getProductsService= async(queryFilters, queries)=>{
   // console.log(queries, queries.fields)
   const products = await Product.find(queryFilters)
   .skip(queries.skip)
   .limit(queries.limit)
   .select(queries.fields)
   .sort(queries.sortBy);

   const totalProducts = await Product.countDocuments(queryFilters);
   const pageCount = Math.ceil(totalProducts/queries.limit);
   return {totalProducts, pageCount, products};

}


exports.createProductService = async(data)=>{
    const product = new Product(data);
        const result = await product.save();
        return result;
}


exports.updateProductService = async(productId, data)=>{
     const result = await Product.updateOne({_id: productId}, {$set: data}, {
        runValidators:true
     });
    //  const result = await Product.updateOne({_id: productId}, {$inc: data}, {
    //     runValidators:true
    //  });

    //  const product = await Product.findById(productId);
    //  const result = await product.set(data).seve();
     return result;
}

exports.bulkUpdateProductService = async(data)=>{
    //  const result = await Product.updateMany({_id: data.ids},  data.data, {
    //     runValidators:true
    //  });
    const products = [];
    data.ids.forEach(product =>{
      products.push(Product.updateOne({_id: product.id}, product.data))  ;
    });

   const result = await Promise.all(products);
     console.log(result)
     return result;
}

exports.deleteProductByIdService=async(id)=>{
   const result = await Product.deleteOne({_id:id});
   return result;
}


exports.bulkDeleteProductService = async(ids)=>{
   const objectIdArray = ids.map(id => new  mongoose.Types.ObjectId(id)); // Ensure the ids are valid ObjectId instances
        const result = await Product.deleteMany({ _id: { $in: objectIdArray } });
        return result;
   // console.log(ids)
   //   const result = await Product.updateMany({ _id: ids} );
   //   return result;
}