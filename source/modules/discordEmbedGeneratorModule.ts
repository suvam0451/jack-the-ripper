import * as discord from "discord.js";
import { IGelbooruSearch } from "../types/apiResponses";
import { IGelbooruImageSearchResults } from "../types/apiResponses";

/** Twitter carousal for art images */
export const TwitterImageCarousal = (
  username: string,
  image_link: string,
  current: number,
  ceil: number
) =>
  new discord.MessageEmbed()
    .setTitle(`NSFW from ${username}`)
    .setImage(image_link)
    .setDescription(`Browsing (nsfw) : ${current}/${ceil}`)
    .setFooter("List of gallery options : { nsfw, sfw, op, all }");

export const GelbooruSearchResultCarousal = (
  links: IGelbooruSearch[],
  currPage: number,
  maxPage: number
) => {
  let desc = "";
  links.forEach((link, i) => {
    const idString = link.id.toString().padStart(7, " ");
    desc = desc.concat(`${idString} -- ${link.tag} (${link.count}) \n`);
  });

  return new discord.MessageEmbed()
    .setTitle("Search results")
    .setDescription("```" + `${desc}` + "```");
};

export const DanbooruImageBrowser = (
  data: IGelbooruImageSearchResults,
  currIndex: number,
  maxValues: number
) => {
  const { title, file_url, owner } = data;
  return new discord.MessageEmbed()
    .setTitle(`${title == "" ? "Untitled" : title}`)
    .setImage(file_url)
    .setDescription(`Browsing danbooru (${currIndex + 1}/${maxValues})`)
    .setFooter(`from ${owner}`);
};
