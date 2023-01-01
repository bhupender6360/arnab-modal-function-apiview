const yamljs = require("yamljs");
const fs = require("fs");
const axios = require("axios");
const express = require("express");

const app = express();

app.get("/", async (req, res) => {
	res.send("Running...");
});

// ArchiveServices
app.get("/api/v1/apiview", async (req, res) => {
	const { type, name } = req.query;
	const auth_bearer =
		"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2xlIjoiVG9vbEFkbWluaXN0cmF0b3IiLCJPcmdhbmlzYXRpb25JRCI6ImNlNjAxM2ZmLTNhYzMtNDdlOC05MDYxLWQ4NTY0YTM5Y2YzMiIsIk9yZ2FuaXNhdGlvbk5hbWUiOiJCSUFOIiwiZXhwIjoxNjcyNTYyOTg3LCJpc3MiOiJodHRwczovL2FwaS5iaWFuLm9yZyIsImF1ZCI6Imh0dHBzOi8vYXBpLmJpYW4ub3JnIn0.l7gxnkq5xo_ht4tJyYADfaVoqoQMOeWNrzBGy9zjJ3c";

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
