const jwt = require('jsonwebtoken')
const Token = require('../models/tokenModel');

class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN })
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN })
		return { accessToken, refreshToken }
	}

	async saveToken(userId, refreshToken) {
		const tokenData = await Token.findOne({ where: { userId } })
		if (tokenData) {
			await Token.update({ refreshToken }, { where: { id: tokenData.dataValues.id } });
			return refreshToken
		} else {
			await Token.create({ userId, refreshToken })
			return refreshToken
		}
	}

	async removeToken(refreshToken) {
		return await Token.destroy({ where: { refreshToken } })
	}

	async findToken(refreshToken) {
		return await Token.findOne({ where: { refreshToken } })
	}

	validateAccessToken(token) {
		try {
			return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
		} catch (error) {
			return null
		}
	}

	validateRefreshToken(token) {
		try {
			return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
		} catch (error) {
			return null
		}
	}
}

module.exports = new TokenService()