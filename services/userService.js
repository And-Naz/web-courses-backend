const bcrypt = require('bcrypt')
const uuid = require('uuid')
// const { Op } = require("sequelize");
// const { User } = require('../models')
const TokenService = require('./TokenService')
// const UserDto = require('../dtos/UserDto')
// const ApiError = require('../exceptions/ApiError')

class UserService {
	async registration({ userName, email, password, gender }) {
		// const candidate = await User.findOne({
		// 	where: {
		// 		[Op.or]: [
		// 			{ userName },
		// 			{ email }
		// 		]
		// 	}
		// })
		// if (candidate) {
		// 	throw ApiError.Conflict(`User with email ${email} already exists`)
		// }
		// const hashPassword = await bcrypt.hash(password, Number(process.env.PASSWORD_HASHING_SALT))
		// const activationLink = uuid.v4()
		// const user = await User.create({
		// 	userName, email, gender, activationLink, password: hashPassword
		// })
		// const userDto = new UserDto(user.dataValues)
		// const tokens = TokenService.generateTokens({ ...userDto })
		// await TokenService.saveToken(userDto.id, tokens.refreshToken)
		// return { ...tokens, user: userDto }
	}

	async activate(activationLink) {
		// const user = await User.findOne({ where: { activationLink } })
		// if (!user) {
		// 	throw ApiError.BadRequest('Incorrect activation link')
		// }
		// await User.update({ isActivated: true }, { where: { id: user.dataValues.id } });
	}

	async login(userNameOrEmail, password) {
		// const user = await User.findOne({
		// 	where: {
		// 		[Op.or]: [
		// 			{ username: userNameOrEmail },
		// 			{ email: userNameOrEmail }
		// 		]
		// 	}
		// })
		// if (!user) {
		// 	throw ApiError.NotFound(`User with email ${email} doesn't exists`)
		// }
		// const isPasswordEqual = await bcrypt.compare(password, user.password)
		// if (!isPasswordEqual) {
		// 	throw ApiError.BadRequest('Invalid password')
		// }
		// const userDto = new UserDto(user.dataValues)
		// const tokens = TokenService.generateTokens({ ...userDto })
		// await TokenService.saveToken(userDto.id, tokens.refreshToken)
		// return { ...tokens, user: userDto }
	}

	async logout(refreshToken) {
		// const tokenRetVal = await TokenService.removeToken(refreshToken)
		// return !!tokenRetVal
	}

	async refresh(refreshToken) {
		// if (!refreshToken) {
		// 	throw ApiError.UnauthorizedError()
		// }
		// const userData = TokenService.validateRefreshToken(refreshToken)
		// if (!userData) {
		// 	throw ApiError.UnauthorizedError()
		// }
		// const tokenFromDB = await TokenService.findToken(refreshToken)
		// if (!tokenFromDB) {
		// 	throw ApiError.UnauthorizedError()
		// }

		// const user = await User.findByPk(userData.id)
		// const userDto = new UserDto(user.dataValues)
		// const tokens = TokenService.generateTokens({ ...userDto })
		// await TokenService.saveToken(userDto.id, tokens.refreshToken)
		// return { ...tokens, user: userDto }
	}

	async getAllUsers() {
		// return await User.findAll()
	}
}

module.exports = new UserService()