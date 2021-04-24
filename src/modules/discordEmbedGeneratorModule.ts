import * as discord from "discord.js";

/** Twitter carousal for art images */
export const TwitterImageCarousal = (
  username: string,
  image_link: string,
  current: number,
  ceil: number
) => {
  return new discord.MessageEmbed()
    .setTitle(`NSFW from ${username}`)
    .setImage(image_link)
    .setDescription(`Browsing (nsfw) : ${current}/${ceil}`)
    .setFooter("List of gallery options : { nsfw, sfw, op, all }");
};
