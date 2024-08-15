const User = require('../models/UserModel')
const bcrypt = require("bcrypt")
const { generalAccessToken, refeshAccessToken} = require('./JwtServices')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { email, password, confirmPassword } = newUser
        try{
            const checkUser = await User.findOne({
                email: email
            })

            if (checkUser !== null){
                resolve({
                    status: 'ERR',
                    message: 'Email existed!'
                })
            }

            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                email,
                password : hash,
            })

            if (createdUser){
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

const loginUser = (userlogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userlogin
        try{
            const checkUser = await User.findOne({
                email: email
            })

            if (checkUser === null){
                resolve({
                    status: 'ERR',
                    message: 'User is not defined'
                })
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword){
                resolve({
                    status: 'ERR',
                    message: 'The password or user is incorrect!'
                })
            }
            
            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await refeshAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })
        } catch(e) {
            reject(e)
        }
    })
}

const loginUserByPhone = (userlogin) => {
    return new Promise(async (resolve, reject) => {
        const { phone, password } = userlogin
        try{
            const checkUser = await User.findOne({
                phone: phone
            })

            if (checkUser === null){
                resolve({
                    status: 'ERR',
                    message: 'User is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword){
                resolve({
                    status: 'ERR',
                    message: 'The password or phone is incorrect!'
                })
            }
            
            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await refeshAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
            status: 'OK',
            message: 'SUCCESS',
            access_token,
            refresh_token
            })
        } catch(e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try{

            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser === null){
                resolve({
                    status: 'ERR',
                    message: 'User is not defined'
                })
            }
            if (data?.password){
                const hash = bcrypt.hashSync(data.password, 10)
                data.password = hash
            }
            const updateUser = await User.findByIdAndUpdate(id, data)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateUser
            })
        } catch(e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser === null){
                resolve({
                    status: 'OK',
                    message: 'User is not defined'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
            status: 'OK',
            message: 'USER DELETED!'
            })
        } catch(e) {
            reject(e)
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try{
            console.log('service', ids)
            await User.deleteMany({_id: ids})
            resolve({
                status: 'OK',
                message: 'USERS DELETED!'
            })
        } catch(e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allUser = await User.find()

            resolve({
                status: 'OK',
                message: 'SUCCESS!',
                data: allUser
            })
        } catch(e) {
            reject(e)
        }
    })
}

const getDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const userId = await User.findOne({
                _id: id
            })
    
            if (!userId){
                resolve({
                    status: "ERR",
                    message: "User is not defined!"
                })
            }

            const access_token = await generalAccessToken({
                id: userId.id,
                isAdmin: userId.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS!',
                data: userId,
                access_token
            })
        } catch(e) {
            reject(e)
        }
    })
}
module.exports = {createUser, loginUser, updateUser, deleteUser, deleteManyUser, getAllUser, getDetails}