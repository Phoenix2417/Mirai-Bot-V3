module.exports.config = {
	name: "prefix",	
	version: "4.0.0", 
	hasPermssion: 0,
	credits: "Vtuan",
	description: "sos", 
	commandCategory: "Hệ Thống",
	usages: "",
	cooldowns: 0
};
module.exports.handleEvent = async function ({ api, event, Threads }) {

	const request = require('request');

	const fs = require("fs");

	var { threadID, messageID, body } = event,{ PREFIX } = global.config;

	let threadSetting = global.data.threadData.get(threadID) || {};

	let prefix = threadSetting.PREFIX || PREFIX;

	const timeStart = Date.now();

	if (body.toLowerCase() == "Prefix" || (body.toLowerCase() == "prefix")) {

					return api.sendMessage({

				body: `╭𝐏𝐫𝐞𝐟𝐢𝐱 𝐡𝐞̣̂ 𝐭𝐡𝐨̂́𝐧𝐠:${global.config.PREFIX}\n╰𝐏𝐫𝐞𝐟𝐢𝐱 𝐜𝐮̉𝐚 𝐧𝐡𝐨́𝐦:${prefix}`},event.threadID,event.messageID);

 }

}

module.exports.run = async ({ api, event, args, Threads }) => {}