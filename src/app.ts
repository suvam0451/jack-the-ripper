import * as discord from "discord.js";
import * as dotenv from "dotenv";
import axios from "axios";
dotenv.config();

import * as util from "./utility";
import * as twitUtil from "./twitterUtility";
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
      .FetchImageLinksForTweets(sfwLinks, 20)
      .then((tally) => {
        showcaseImages = tally;
        util.AppendLinesToFile(SFW_OUTPUT_FILE, tally);
      });

    // Fetch image links for NSFW tagged images
    let second = twitUtil
      .FetchImageLinksForTweets(nsfwLinks, 20)
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
      await msgNode.react('🍎');
      await msgNode.react('🍊');

      // msgNode.react(message.guild.emojis.cache.find(emoji => emoji.name === 'arrow_left'));
      // msgNode.react(message.guild.emojis.cache.find(emoji => emoji.name === 'arrow_right'));
    });
  });

  msgHandler(client, ["version"], (msg) => {});
});

client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
  console.log("Logged in successfully !");
});
