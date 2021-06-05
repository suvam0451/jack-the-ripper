import * as discord from "discord.js";
import axios, { AxiosResponse } from "axios";
import config from "./config/config";

import * as generalUtil from "./modules/generalUtilityModule";
import * as embedUtil from "./modules/discordEmbedGeneratorModule";
import * as docsUtil from "./modules/documentationProvider";
// Modules
import msgHandler from "./handlers/messagehandler";
import { attachIsImage } from "./handlers/imagehandler";
import {
  paramsAdequate,
  validateMessageArguments,
  attachPagination,
} from "./utility";
import {
  IGelbooruSearch,
  ITweetsSearch,
  IGelbooruImageSearchResults as IGelbooruImageSearchResult,
} from "./types/apiResponses";
import { APIClient } from "./utils/network";

// const Twitter = new Twit(require("../twit_config"));

const client = new discord.Client();

client.on("ready", async () => {
  console.log("Client is ready");
  msgHandler(client, ["ping"], (message) => {});

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

  /** An interface to browser */
  class EmbedBrowser {
    current_index: number;
    maximum_index: number;
    display_index: number;

    constructor(max: number) {
      this.current_index = 0;
      this.display_index = 1;
      this.maximum_index = max;
    }

    next() {
      if (this.current_index == this.maximum_index - 1) this.current_index = 0;
      else this.current_index = this.current_index + 1;
      this.display_index = this.current_index + 1;
    }

    previous() {
      if (this.current_index == 0) this.current_index = this.maximum_index - 1;
      else this.current_index = this.current_index + 1;
      this.display_index = this.current_index + 1;
    }
  }

  msgHandler(client, ["twitter", "t"], async (message) => {
    let params = message.content.split(" ");
    if (params.length < 2) {
      message.channel.send(
        "You need to provide me a twitter username to scrape as second argument..."
      );
      return;
    }

    const USERNAME = params[1];
    if (USERNAME == "help") {
      docsUtil.provideTwitterScraperDocs(message);
      return;
    }

    APIClient()
      .get<any, AxiosResponse<ITweetsSearch>>(`/tweets/nsfw/${params[1]}`)
      .then(async (res) => {
        if (res.status == 200) {
          let { nsfw, username } = res.data;
          let browser = new EmbedBrowser(nsfw.length);

          if (nsfw.length > 1) {
            let msgNode = await message.channel.send(
              embedUtil.TwitterImageCarousal(
                username,
                nsfw[browser.current_index],
                browser.display_index,
                browser.maximum_index
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
              switch (reaction.emoji.name) {
                case "🍎":
                  browser.previous();
                  break;
                case "🍊":
                  browser.next();
                  break;
              }
              // Update image on embed
              msgNode.edit(
                embedUtil.TwitterImageCarousal(
                  username,
                  nsfw[browser.current_index],
                  browser.display_index,
                  browser.maximum_index
                )
              );
              reaction.users.remove(user);
            });
          }
        } else if (res.status == 404) {
          message.channel.send("404: No twitter user exists with this id");
          return;
        }
      });
  });

  msgHandler(client, ["gelbooru", "g"], async (message) => {
    const { valid, msg, params, numParams } = validateMessageArguments(
      message.content,
      2
    );

    if (numParams < 1) {
      // TODO: print manual
      return;
    }
    switch (params[0]) {
      case "tags": {
        if (!paramsAdequate(message, numParams, 2)) return;
        APIClient()
          .get<any, AxiosResponse<IGelbooruSearch[]>>(
            `/gelbooru/search/tags/${params[1]}`
          )
          .then(async (res) => {
            if (res.status == 200) {
              let freshData = res.data
                .filter((o) => o.count > 0)
                .sort((a, b) => b.count - a.count);

              let msgNode = await message.channel.send(
                embedUtil.GelbooruSearchResultCarousal(freshData, 0)
              );
            }
          });
        break;
      }

      case "characters": {
        if (!paramsAdequate(message, numParams, 2)) return;
        APIClient()
          .get<any, AxiosResponse<IGelbooruSearch[]>>(
            `/gelbooru/search/characters/${params[1]}`
          )
          .then(async (res) => {});
      }
      case "nsfw": {
        const query = params[1];
        APIClient()
          .get<any, AxiosResponse<IGelbooruImageSearchResult[]>>(
            `/gelbooru/search/nsfw/${query}`
          )
          .then(async ({ data }) => {
            if (data && data.length > 0) {
              attachPagination<IGelbooruImageSearchResult>(
                message,
                data,
                embedUtil.DanbooruImageBrowser
              );
            }
          })
          .catch((err) => {
            console.log("request failed: ", err.response.data.reason);
            message.channel.send(
              err.response.data.reason
                ? err.response.data.reason
                : "some unknown error occured"
            );
          });
        // IGelbooruImageSearchResults
        break;
      }
      default:
        message.channel.send(
          "available modules: { characters, tags, franchises, artists }"
        );
        break;
    }
  });

  msgHandler(client, ["mp3"], async (message) => {});

  msgHandler(client, ["version"], (msg) => {});
});

client.login(config.server.token).then(() => {
  console.log("Logged in successfully !");
});
