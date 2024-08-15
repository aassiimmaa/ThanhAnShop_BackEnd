const Product = require('../models/ProductModel')
const bcrypt = require("bcrypt")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const {name, image, type, price, countInStock, rating, description} = newProduct
        try{
            const checkProduct = await Product.findOne(
               {
                name: name
               }
            )
            if (checkProduct !== null){
                resolve({
                    status: "ERR",
                    message: "Product existed!"
                })
            }
            const createNewProduct = await Product.create({
                name, image, type, price, countInStock, rating, description
            })
            if (createNewProduct){
                resolve({
                    status: 'OK',
                    message: 'Create Product Successfully!',
                    data: createNewProduct
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkProduct = await Product.findOne({
                _id: id
            })

            if (checkProduct === null){
                resolve({
                    status: 'OK',
                    message: 'Product is not defined!'
                })
            }
            const updateProduct = await Product.findByIdAndUpdate(id, data)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateProduct
            })
        } catch(e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkProduct = await Product.findOne({
                _id: id
            })

            if (checkProduct === null){
                resolve({
                    status: 'OK',
                    message: 'Product is not defined'
                })
            }

            await Product.findByIdAndDelete(id)
            resolve({
            status: 'OK',
            message: 'PRODUCT DELETED!'
            })
        } catch(e) {
            reject(e)
        }
    })
}

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try{
            await Product.deleteMany({ _id: ids})
            resolve({
                status: 'OK',
                message: 'PRODUCTS DELETED!'    
            })
        } catch(e) {
            reject(e)
        }
    })
}

const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const productId = await Product.findOne({
                _id: id
            })

            if (!productId){
                resolve({
                    status: "ERR",
                    message: "Product is not defined!"
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS!',
            data: productId
            })
        } catch(e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try{
            const totalProduct = await Product.countDocuments()
            if (sort){
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip(limit * page).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'SUCCESS!',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: page + 1,
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }

            if (filter){
                const allObjectFilter = await Product.find({[filter[0]]: {'$regex': filter[1], $options: 'i'}}).limit(limit).skip(limit * page)
                resolve({
                    status: 'OK',
                    message: 'SUCCESS!',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: page + 1,
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if (!sort || !filter){
                var allProduct;
                if (limit > 0){
                    allProduct = await Product.find().limit(limit).skip(limit*page)
                }else{
                    allProduct = await Product.find()
                }
                resolve({
                    status: 'OK',
                    message: 'SUCCESS!',
                    data: allProduct,
                    total: totalProduct,
                    pageCurrent: page + 1,
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'SUCCESS!',
                data: allType
            })
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {createProduct, updateProduct, deleteProduct, getDetailProduct, getAllProduct, deleteManyProduct, getAllType}