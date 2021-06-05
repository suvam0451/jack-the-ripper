import * as discord from "discord.js";

const VERSION = "v0.0.1";

/** Documentaion for the bot in it's whole */
export const provideBotDocs = (messageRef: discord.Message) => {
  messageRef.channel.send(
    new discord.MessageEmbed()
      .setTitle(`Auto Memory Doll (${VERSION})`)
      .setColor(0x00ae86)
      .setDescription(
        "Hello. I help with content browsing, scraping and downloading with various popular sites."
      )
      .addField("Web Scrapers", "(t)witter, (nh)entai")
      .addField("Browsing Utilities", "(t)witter")
      .setFooter("https://github.com/suvam0451/auto-memory-doll")
  );
};

export const provideTwitterScraperDocs = (messageRef: discord.Message) => {
  messageRef.channel.send(
    new discord.MessageEmbed()
      .setTitle("Twitter Scraping Module")
      .setColor(0x00ae86)
      .setDescription(
        `This module allows viewing/downloading of images from twitter handles.`
      )
      .addField("aliases", "t, twitter")
      .addField(
        "usage",
        `\t$t suvam0451
      \t$t suvam0451 100  // Limit number of tweets to fetch. 0 for everything. default 200.
      \t$t suvam0451 nsfw // nsfw is default. alternative : sfw/op/all`,
        false
      )
      .addField(
        "altenatives",
        "\t$t https://twitter.com/Tiamant_Torriet/status/1385585296037670913 // full links"
      )
      .addField(
        "info",
        `    \t- op mode fetches original posts (no retweets)
      \t- all fetches everything
      \t- server caches links. every request after first is instanteneous.
      \t- moderating users can force request an update, per username`
      )
      .setFooter(
        "This bot is slightly patched and privately hosted in select servers. However, you can spin up your instance using https://github.com/suvam0451/auto-memory-doll"
      )
  );
};
