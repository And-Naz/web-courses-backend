const DbConnection = require('./dbConnection')
const connection = new DbConnection('users.json', User);

class User {
	static get db() { return connection; }
	static uniqueKeys = ["id", "email"];

	constructor({ id, password, email, name, surname, age }) {
		if (!id) {
			throw new Error("Id is required.")
		}
		if (!password) {
			throw new Error("Password is required.")
		}
		if (!email) {
			throw new Error("Email is required.")
		}
		this.id = id;
		this.password = password
		this.email = email;
		this.name = name;
		this.surname = surname;
		this.age = age
	}
}

module.exports = User;