const UserServices = require('../services/UserServices')
const JwtServices = require('../services/JwtServices')

const createUser = async (req, res) => {
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
    try {
        const { email, password, confirmPassword } = req.body
        const isCheck = isValidEmail(email)
        if ( !email || !password || !confirmPassword ){
            return res.status(200).json({
                status: "ERR",
                message: 'The input is required'
            })
        }else if(!isCheck){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }else if(password !== confirmPassword){
            return res.status(200).json({
                status: 'ERR',
                message: 'The password is not equal confirm password'
            })
        }
        const response = await UserServices.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
    try {
        const { email, password } = req.body
        const isCheck = isValidEmail(email)
        if (!email || !password){
            return res.status(200).json({
                status: "ERR",
                message: 'The input is required'
            })
        }else if(!isCheck){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }
        const response = await UserServices.loginUser(req.body)
        const { refresh_token, ...newResponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict'
        })
        return res.status(200).json(newResponse)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUserByPhone = async (req, res) => {
    function isValidPhone(phone) {
        const emailPattern = /\(\d{3}\)\s*\d{3}-\d{4}/
        return emailPattern.test(email);
    }
    try {
        const { email, password } = req.body
        const isCheck = isValidEmail(email)
        console.log(email, password)
        if (!email || !password){
            return res.status(200).json({
                status: "ERR",
                message: 'The input is required'
            })
        }else if(!isCheck){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }
        const response = await UserServices.loginUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId){
            return res.status(200).json({
                status: "ERR",
                message: "UserID is required"
            })
        }
        const response = await UserServices.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId){
            return res.status(200).json({
                status: "ERR",
                message: "UserID is required"
            })
        }
        const response = await UserServices.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteManyUser = async (req, res) => {
    try {
        const ids = req.body
        if (!ids){
            return res.status(200).json({
                status: "ERR",
                message: "ids is required"
            })
        }
        const response = await UserServices.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserServices.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetails = async (req, res) => {
    try {
        const userId = req.params.id
        
        if (!userId){
            return res.status(200).json({
                status: "ERR",
                message: "UserID is required"
            })
        }

        const response = await UserServices.getDetails(userId)

        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token
        if (!token){
            return res.status(200).json({
                status: "ERR",
                message: "The token is required"
            })
        }

        const response = await JwtServices.refreshToken(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            cookie: res.cookie,
            status: 'OK',
            message: 'Logout Successfully!'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {createUser, loginUser, updateUser, deleteUser, deleteManyUser, getAllUser, getDetails, refreshToken, logoutUser}