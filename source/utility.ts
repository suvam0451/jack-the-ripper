import * as os from "os";
import * as fs from "fs";
import * as discord from "discord.js";

export const AppendLinesToFile = (filepath: string, lines: string[]) => {
  lines.forEach((line) => {
    fs.appendFileSync(filepath, line + os.EOL);
  });
};

export const createEmptyFile = async (filepath: string) => {
  await fs.writeFile(filepath, "", () => {});
};

export const validateMessageArguments = (
  message: string,
  params_required: number
) => {
  let params = message.split(" ");
  params.shift();
  if (params.length < params_required) {
    return {
      valid: true,
      msg: `expected ${params_required} arguments for this command, got ${params.length}`,
      params: params,
      numParams: params.length,
    };
  } else {
    return {
      valid: true,
      msg: "lgtm",
      params: params,
      numParams: params.length,
    };
  }
};

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
    else this.current_index = this.current_index - 1;
    this.display_index = this.current_index + 1;
  }
}

export const paramsAdequate = (
  message: discord.Message,
  source: number,
  target: number
): boolean => {
  if (source < target) {
    message.channel.send("expected one more string argument to fetch tags");
    return false;
  }
  return true;
};

export async function attachPagination<T>(
  message: discord.Message,
  dataSource: T[],
  browserCallback: (data: T, curr: number, max: number) => discord.MessageEmbed
) {
  let browser = new EmbedBrowser(dataSource.length);
  let msgNode = await message.channel.send(
    browserCallback(dataSource[0], 0, dataSource.length)
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
      case "🍎": {
        browser.previous();
        break;
      }
      case "🍊": {
        browser.next();
        break;
      }
      default: {
        break;
      }
    }
    // Update image on embed
    msgNode.edit(
      browserCallback(
        dataSource[browser.current_index],
        browser.current_index,
        dataSource.length
      )
    );
    reaction.users.remove(user);
  });
}
