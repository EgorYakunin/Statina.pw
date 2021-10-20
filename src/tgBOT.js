fs = require('fs')

const TelegramBot = require('node-telegram-bot-api')

const token = '1856939218:AAFqkUnd41GlsnbqNelnwX3EZGqMtcjguOg'

const bot = new TelegramBot(token, { polling: true })
const pass = '123'

parseUser = (dbName) => {
    let dataBuffer = fs.readFileSync(dbName)
    let dataJSON = dataBuffer.toString()
    let data = JSON.parse(dataJSON)
    return data
}

const configureTgOptions = (phone) => {
    return tgOptions = {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '☎️ call the person', url: 'https://yakunin.design/call.php?tel='+phone }]
            ]
        })
    }
}

bot.onText(/\/echo (.+)/, async (msg, match) => {
    const chatId = msg.chat.id
    const resp = match[1]

    await bot.sendMessage(chatId, resp)
})

addUser = (user) => {
    userId = user.id
    firstName = user.first_name
    lastName = user.last_name
    username = user.username

    users = parseUser('db.json')

    users.push(
        {
            "userId": userId,
            "firstName": firstName,
            "lastName": lastName,
            "username": username
        }
    )

    let userJSON = JSON.stringify(users)
    fs.writeFileSync('db.json', userJSON)

}

const sendMessages = (msg, phone=undefined) => {
    users = parseUser('db.json')
    users.forEach(e => {
        bot.sendMessage(e.userId, msg, configureTgOptions(phone))
    })
}

const sendPhotos = (imgUrls) => {
    users = parseUser('db.json')
    imgUrls.forEach((img) => {
        users.forEach(e => {
            bot.sendPhoto(e.userId, img.path)
        })
    })
}

bot.onText(/\/reg (.+)/, async (msg, match) => {
    const chatId = msg.chat.id
    const resp = match[1]
    let alreadyRegestered = false

    // preventing multiple regestrations from one person
    users = parseUser('db.json')
    users.forEach(e => {
        if (e.userId == msg.chat.id) {
            alreadyRegestered = true
        }
    })

    if (!alreadyRegestered) {
        if (pass == resp) {
            addUser(msg.chat)
            await bot.sendSticker(chatId, './tgServerCat/3.webp')
            await bot.sendMessage(chatId, 'Все настроено и готово к работе!')
        } else {
            await bot.sendMessage(chatId, 'wrong password')
        }
    } else {
        await bot.sendSticker(chatId, './tgServerCat/4.webp')
        await bot.sendMessage(chatId, 'Вы уже зарегистрированы!')
    }
})

bot.onText(/\/send (.+)/, async (msg, match) => {
    const resp = match[1]
    sendMessages(msg.chat.first_name + ' ' + msg.chat.last_name + ': ' + resp, undefined)
})

module.exports = {
    sendMessages,
    sendPhotos
}