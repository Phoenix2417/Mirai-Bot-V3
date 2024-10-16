const { randomInt } = require("crypto");

module.exports.config = {
    name: "cardgame",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "Chơi game bài J, Q, K, A",
    commandCategory: "game",
    usages: "cardgame",
    cooldowns: 5
};

let players = [];
let deck = [];
let currentTurn = 0;
let botCard = '';
let cardsOnTable = {};
let isPlaying = false; 

const values = ['J', 'Q', 'K', 'A']; 

module.exports.run = function({ api, event }) {
    const { threadID, messageID, senderID } = event;

    if (isPlaying) {
        api.sendMessage("Trò chơi đang diễn ra. Vui lòng chờ kết thúc ván đấu hiện tại.", threadID, messageID);
        return;
    }

    if (players.length < 4) {
        if (!players.includes(senderID)) {
            players.push(senderID);
            api.sendMessage(`Người chơi ${players.length} đã tham gia trò chơi. Còn thiếu ${4 - players.length} người.`, threadID, messageID);
        } else {
            api.sendMessage(`Bạn đã tham gia trò chơi!`, threadID, messageID);
        }

        if (players.length === 4) {
            isPlaying = true;
            startGame(api, threadID);
        }
    }
};

async function startGame(api, threadID) {
    deck = createDeck();
    deck = shuffle(deck);
    cardsOnTable = {};
    currentTurn = randomInt(0, 4);  
    botCard = values[randomInt(0, values.length)];

    for (let player of players) {
        cardsOnTable[player] = drawCards(5);
        await api.sendMessage(`Bài của bạn: ${cardsOnTable[player].join(", ")}.\n\nBot yêu cầu bạn đánh bài: ${botCard}.\nHãy chọn bài và gửi tin nhắn số tương ứng với lá bài muốn đánh.`, player);  // Gửi bài riêng qua tin nhắn
    }

    api.sendMessage(`Trò chơi bắt đầu! Người đầu tiên là người chơi số ${currentTurn + 1}. Bot yêu cầu đánh bài: ${botCard}.`, threadID);
}

function drawCards(num) {
    let cards = [];
    for (let i = 0; i < num; i++) {
        cards.push(deck.pop());
    }
    return cards;
}

function createDeck() {
    let deck = [];
    for (let value of values) {
        deck.push(value, value, value, value);
    }
    return deck;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports.handleReply = async function({ api, event, handleReply }) {
    const { threadID, messageID, body, senderID } = event;
    const input = body.trim().toLowerCase();

    if (input === 'lật') {
        const previousPlayer = players[(currentTurn - 1 + 4) % 4];
        const cardsPlayed = handleReply.cardsPlayed;

        if (cardsPlayed.includes(botCard)) {
            api.sendMessage(`Người chơi ${previousPlayer} đã đánh đúng bài! Người chơi ${senderID} bị loại.`, threadID);
            players = players.filter(player => player !== senderID);
        } else {
            api.sendMessage(`Người chơi ${previousPlayer} đã lừa dối! Người chơi ${previousPlayer} bị loại.`, threadID);
            players = players.filter(player => player !== previousPlayer);
        }

        if (players.length === 1) {
            api.sendMessage(`Trò chơi kết thúc! Người chơi ${players[0]} là người chiến thắng!`, threadID);
            resetGame();
        } else {
            nextTurn(api, threadID);
        }
    } else {
        const cards = input.split(' ');
        handleReply.cardsPlayed = cards;

        api.sendMessage(`Người chơi ${senderID} đã đánh bài: ${cards.join(', ')}.`, threadID);
        currentTurn = (currentTurn + 1) % 4;
        api.sendMessage(`Người chơi ${players[currentTurn]}, hãy chọn bài hoặc lật bài.`, threadID);
    }
};

function nextTurn(api, threadID) {
    if (players.length > 1) {
        api.sendMessage(`Người chơi ${players[currentTurn]}, đến lượt bạn. Hãy đánh bài hoặc lật bài của người trước đó.`, threadID);
    }
}

function resetGame() {
    players = [];
    deck = [];
    currentTurn = 0;
    botCard = '';
    cardsOnTable = {};
    isPlaying = false;
}