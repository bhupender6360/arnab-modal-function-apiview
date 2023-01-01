const yamljs = require("yamljs");
const fs = require("fs");
const axios = require("axios");
const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config()

app.get("/", async (req, res) => {
	res.send("Running...");
});

// ArchiveServices
app.get("/api/v1/apiview", async (req, res) => {
	const { type, name } = req.query;
	const auth_bearer =
		"Bearer " + process.env.NODE_ENV_JWT_TOKEN;
	let url =
		"https://bian-modelapi-sandbox-v3.azurewebsites.net/ApiByName/ArchiveServices";
	if (name) {
		url =
			"https://bian-modelapi-sandbox-v3.azurewebsites.net/ApiByName/" +
			name +
			"/";
	}
	await axios
		.get(url, { headers: { Authorization: auth_bearer } })
		.then(function (response) {
			let nativeObject = response.data[0].oaS3_YAML;
			if (type === "json") {
				nativeObject = yamljs.parse(response.data[0].oaS3_YAML);
			}
			res.json({
				status: true,
				message: "Sussessfully Fetched",
				data: nativeObject,
				type,
				name,
			});
		})
		.catch(function (error) {
			res.json({
				status: false,
				message: error.message,
				data: {},
				type,
				name,
			});
		});
});

app.listen(4000, function () {
	console.log("listening on port 4000");
});
