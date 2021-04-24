import * as discord from "discord.js";
import * as dotenv from "dotenv";
import axios from "axios";
dotenv.config();

import * as util from "./utility";
import * as twitUtil from "./twitterUtility";
import * as twitterScraper from "./modules/twitterScraperModule";
import * as generalUtil from "./modules/generalUtilityModule";
import * as embedUtil from "./modules/discordEmbedGeneratorModule";
import * as docsUtil from "./modules/documentationProvider";
// Modules
import msgHandler from "./handlers/messagehandler";
import { attachIsImage } from "./handlers/imagehandler";
import Twit, { Response } from "twit";
import { Url } from "node:url";

const Twitter = new Twit(require("../twit_config"));

const client = new discord.Client();

type TweetMediaInfo = {
  data: {
    attachments: {
      media_keys: string[];
    };
    id: string;
    text: string;
  }[];
  includes: {
    media: {
      media_key: string;
      type: "photo";
      url: string; // Url
    }[];
  };
};

client.on("ready", async () => {
  console.log("Client is ready");
  msgHandler(client, ["ping"], (message) => {
    message.channel.send("Pong" + process.env.ID_DEB);
    // if (message.sender === process.env.ID_DEB) {
    //     message.channel.send("It will be as you say.. Onii-chan <3")
    // }
  });

  msgHandler(client, ["h", "help", "docs"], (message) => {
    docsUtil.provideBotDocs(message);
  });

  msgHandler(client, ["rip", "ripper"], (message) => {
    message.channel.send("Greet the ripper !!!");
  });

  msgHandler(client, ["status", "queue"], (message) => {
    message.channel.send("Pong");
  });

  msgHandler(client, ["image"], (message) => {
    if (message.attachments.size > 0) {
      if (message.attachments.every(attachIsImage)) {
        //something
        console.log("Images found...");
      } else {
        console.log("Images not found...");
      }
    }
  });

  msgHandler(client, ["twitter", "t"], async (message) => {
    let params = message.content.split(" ");
    if (params.length < 2) {
      message.channel.send(
        "400: You need to provide me a twitter username to scrape as second argument..."
      );
      return;
    }

    const USERNAME = params[1];
    if (USERNAME == "help") {
      docsUtil.provideTwitterScraperDocs(message);
      return;
    }

    let res = await twitUtil.processTwitterUserByUsername(USERNAME);
    console.log("processing request: ", res);
    if (!res) message.channel.send("404: No twitter user exists with this id");
    else {
      let links = await twitterScraper.scrapeByTwitterID(res.id);
      // remove dead links
      links.sfw = links.sfw.filter((e) => e != undefined);
      links.nsfw = links.nsfw.filter((e) => e != undefined);

      let current_key = 0;
      let maximum_key = links.nsfw.length;
      if (links.nsfw.length > 1) {
        let msgNode = await message.channel.send(
          embedUtil.TwitterImageCarousal(
            USERNAME,
            links.nsfw[current_key],
            current_key + 1,
            maximum_key
          )
        );
        await msgNode.react("🍎");
        await msgNode.react("🍊");

        let reaper = await msgNode.createReactionCollector(
          (reaction, user) =>
            reaction.emoji.name == "🍎" || reaction.emoji.name == "🍊",
          { time: 360000 }
        );
        reaper.on("collect", (reaction, user) => {
          let react = reaction.emoji.name;
          if (react == "🍎") {
            current_key = generalUtil.CircularOffset(
              current_key,
              maximum_key,
              -1
            );
          } else if (react == "🍊") {
            current_key = generalUtil.CircularOffset(
              current_key,
              maximum_key,
              1
            );
          }

          // Update image on embed
          msgNode.edit(
            embedUtil.TwitterImageCarousal(
              USERNAME,
              links.nsfw[current_key],
              current_key + 1,
              maximum_key
            )
          );
          reaction.users.remove(user);
        });
      }
    }
  });

  msgHandler(client, ["test"], async (message) => {
    // Generate the necessary temporary files
    const SFW_OUTPUT_FILE = "./sfw_list.txt";
    const NSFW_OUTPUT_FILE = "./nsfw_list.txt";
    const OG_OUTPUT_FILE = "./og_list.txt";
    let showcaseImages = []; // Shuffle some images to be browsable while download finishes
    await util.createEmptyFile(SFW_OUTPUT_FILE);
    await util.createEmptyFile(NSFW_OUTPUT_FILE);
    await util.createEmptyFile(OG_OUTPUT_FILE);

    const ID = "828600385820516352";
    let refreshToken = "";
    let sfwLinks = [];
    let nsfwLinks = [];
    const PAGINATION_LIMIT = 100;
    let tweet_counter = 0;
    do {
      let batchResult = await twitUtil.FetchCurrentBatchTweetsById(
        ID,
        refreshToken
      );
      console.log(`Fetching page ${tweet_counter / 100 + 1}`);

      const { data, refresh_token } = batchResult;
      // Determine the set of sfw, nsfw and og content
      let sfw = data.map((ele) => ele.id);
      let nsfw = data
        .filter((ele) => ele.possibly_sensitive)
        .map((ele) => ele.id);

      // Contat the results for next pagination attempt
      sfwLinks = sfwLinks.concat(sfw);
      nsfwLinks = nsfwLinks.concat(nsfw);
      tweet_counter += 100;
      refreshToken = refresh_token;
    } while (refreshToken != "" && tweet_counter < PAGINATION_LIMIT);

    console.log(nsfwLinks.length, sfwLinks.length);

    // Fetch image links for SFW tagged images
    let first = twitUtil
      .FetchImageLinksForTweets(sfwLinks, "sfw", 20)
      .then((tally) => {
        showcaseImages = tally;
        util.AppendLinesToFile(SFW_OUTPUT_FILE, tally);
      });

    // Fetch image links for NSFW tagged images
    let second = twitUtil
      .FetchImageLinksForTweets(nsfwLinks, "nsfw", 20)
      .then((tally) => {
        util.AppendLinesToFile(NSFW_OUTPUT_FILE, tally);
      });

    Promise.all([first, second]).then(async () => {
      // Finally, provide update to the discord request
      message.channel.send(
        `Found ${nsfwLinks.length} (NSFW) / ${sfwLinks.length} (SFW) files. Downloading...`
      );
      let msgNode = await message.channel.send(
        "Browse your images while they are being downloaded...",
        {
          files: [showcaseImages[0]],
        }
      );
      // msgNode.react('🍎');
      await msgNode.react("🍎");
      await msgNode.react("🍊");

      // msgNode.react(message.guild.emojis.cache.find(emoji => emoji.name === 'arrow_left'));
      // msgNode.react(message.guild.emojis.cache.find(emoji => emoji.name === 'arrow_right'));
    });
  });

  msgHandler(client, ["version"], (msg) => {});
});

client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
  console.log("Logged in successfully !");
});
