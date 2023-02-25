const UserService = require('../services/UserService')
// const { validationResult } = require('express-validator')

class UserController {

	async registration(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest("Validation error", errors.array()))
			}
			const formData = { ...req.body }
			const userData = await UserService.registration(formData)
			res.cookie('refreshToken', userData.refreshToken, { maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN_NUMBER), httpOnly: true })
			return res.status(201).json(userData)
		} catch (e) {
			next(e)
		}
	}

	async login(req, res, next) {
		try {
			const { userNameOrEmail, password } = req.body
			const userData = await UserService.login(userNameOrEmail, password)
			res.cookie('refreshToken', userData.refreshToken, { maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN_NUMBER), httpOnly: true })
			return res.status(200).json(userData)
		} catch (e) {
			next(e)
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			await UserService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.status(204).send()
		} catch (e) {
			next(e)
		}
	}

	async activate(req, res, next) {
		try {
			const activationLink = req.params.link
			await UserService.activate(activationLink)
			return res.status(204).redirect(process.env.CLIENT_URL)
		} catch (e) {
			next(e)
		}
	}

	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const tokens = await UserService.refresh(refreshToken)
			res.cookie('refreshToken', tokens.refreshToken, { maxAge: process.env.JWT_REFRESH_EXPIRES_IN_NUMBER, httpOnly: true })
			return res.status(201).json(tokens)
		} catch (e) {
			next(e)
		}
	}

	async getUsers(req, res, next) {
		try {
			const users = await UserService.getAllUsers()
			return res.status(200).json(users)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new UserController()