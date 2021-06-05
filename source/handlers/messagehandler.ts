import * as discord from "discord.js"
import {Client} from "discord.js";
import * as dotenv from "dotenv";
dotenv.config()

/** Routes post-fixed words to their respective functions */
export default function HandleMessage(client: Client, aliases: string[], callback : (msg : discord.Message) => any) {
    client.on("message", message => {
        const {content} = message

        aliases.forEach(alias => {
            const command = `${process.env.PREFIX}${alias}`

            if(content.startsWith(`${command} `) || content == command) {
                console.log(`Running the command ${command}`)
                callback(message)
            }
        })
    })
}