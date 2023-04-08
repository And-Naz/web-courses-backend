require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Token = require('./models/tokenModel')

const PORT = 8000;
const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use('/static', express.static(__dirname + '/public'));

app.use('/user', require('./router/userRouter'))

app.get("/", (req, res) => {

});

app.post("/", (req, res) => {

});

app.put("/", (req, res) => {

});

app.patch("/", (req, res) => {

});

app.delete("/", (req, res) => {

});

app.listen(PORT, () => {
	console.log(`Server run on ${PORT} port!`);
	;(async () => {
		const findByPk = await Token.findByPk(1);
		const findOne1 = await Token.findOne({ where: { id: 1 } });
		const findOne2 = await Token.findOne({ where: { userId: 1 } });

		console.log(findByPk);
		console.log(findOne1);
		console.log(findOne2);
	})();
});