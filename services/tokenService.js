const jwt = require('jsonwebtoken')
const Token = require('../models/tokenModel');

class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN })
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN })
		return { accessToken, refreshToken }
	}

	async saveToken(userId, refreshToken) {
		const [ tokenData ] = await Token.db.read({ userId })
		if (tokenData) {
			await Token.db.update({ userId, refreshToken });
			return refreshToken
		} else {
			await Token.db.create({ userId, refreshToken })
			return refreshToken
		}
	}

	async removeToken(refreshToken) {
		const [ tokenData ] = await Token.db.read({ userId })
		return await Token.db.delete({ userId: tokenData.userId })
	}

	async findToken(refreshToken) {
		const [ tokenData ] = await Token.db.read({ refreshToken })
		return tokenData;
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