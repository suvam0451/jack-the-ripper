import * as discord from "discord.js"
import * as dotenv from "dotenv"

dotenv.config()

// Modules
import messageHandler from "./handlers/messagehandler"

const client = new discord.Client()


client.on("ready", () => {
    console.log("Client is ready")
    messageHandler(client, ["ping"], message => {
        message.channel.send("Pong" + process.env.ID_DEB + message.sender)
        if (message.sender === process.env.ID_DEB) {
            message.channel.send("It will be as you say.. Onii-chan <3")
        }
    })

    messageHandler(client, ["rip", "ripper"], message => {
        message.channel.send("Greet the ripper !!!")
    })

    messageHandler(client, ["status", "queue"], message => {
        message.channel.send("Pong")
    })
})

client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
    console.log("Logged in successfully !")
})