import axios from "axios";
import * as dotenv from "dotenv";
import * as twitterAPI from "./requestHandlers/twitter";
dotenv.config();

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

/** Builds an axios client */
const MakeClient = () => {
  return axios.create({
    headers: {
      Authorization: `Bearer ${process.env.DISCORD_BEARER}`,
    },
    baseURL: "https://api.twitter.com/2",
  });
};

/** Helper function that actually converts the array of ids to a string request
 *  and fetches results */
export const FetchImageLinksForTweets_Helper = async (tweet_ids: string[]) => {
  let retval: string[] = [];
  const tweet_ids_query = tweet_ids.reduce(
    (prev, curr, idx, entry) => prev + "," + curr
  );
  let res = await MakeClient()
    .get<TweetMediaInfo>(
      `/tweets?ids=${tweet_ids_query}&media.fields=url&expansions=attachments.media_keys`
    )
    .catch((err) => {
      console.log(err);
    });
  if (res) {
    if (res.data.includes) {
      retval = retval.concat(res.data.includes.media.map((ele) => ele.url));
    }
  }
  return retval;
};

/** Retrieves image links attached to tweet(s)
 *  @param batchSize chunk entries into batches and produce appended result
 */
export const FetchImageLinksForTweets = async (
  tweet_ids: string[],
  task_id: string,
  batchSize?: number
): Promise<string[]> => {
  let retval: string[] = [];
  let BATCH_PROGRESS = 0;
  let TOTAL_SIZE = tweet_ids.length;

  if (batchSize) {
    // Process after splitting by batches
    while (BATCH_PROGRESS < TOTAL_SIZE) {
      let temporaryArr = tweet_ids.slice(
        BATCH_PROGRESS,
        Math.min(BATCH_PROGRESS + batchSize, TOTAL_SIZE)
      );
      let tmp = await FetchImageLinksForTweets_Helper(temporaryArr);
      retval = retval.concat(tmp);
      BATCH_PROGRESS += batchSize;
      // this is just a progress bar
      console.log(
        `progress(${task_id ? task_id : ""}): ${Math.min(
          BATCH_PROGRESS,
          TOTAL_SIZE
        )}/${TOTAL_SIZE}`
      );
    }
  } else {
    // If batch sizes is not provided, try to process all links together
    let tmp = await FetchImageLinksForTweets_Helper(tweet_ids);
    retval = retval.concat(tmp);
  }
  return retval;
};

type UserTweetsResponse = {
  data: {
    id: string;
    possibly_sensitive: boolean;
    text: string;
  }[];
  meta: {
    oldest_id: string;
    newest_id: string;
    result_count: 100;
    next_token: string;
  };
};

/** Retrieves tweets by user
 *  Feed forward the refresh_token to fetch more tweets that limit (100)

 */
export const FetchCurrentBatchTweetsById = async (
  id: string,
  refresh_token?: string
) => {
  let res = await MakeClient().get<UserTweetsResponse>(
    `/users/${id}/tweets?max_results=100&tweet.fields=possibly_sensitive${
      refresh_token == "" ? "" : `&pagination_token=${refresh_token}`
    }`
  );

  let { data, meta } = res.data;
  // We only need the id and content sensitivity here. We strip the rest of the content
  const stripMetadata = data.map((ele) => {
    return { id: ele.id, possibly_sensitive: ele.possibly_sensitive };
  });

  return { data: stripMetadata, refresh_token: meta.next_token };
};

/** Retrieves  */
export const FetchMediaLinksForId = async (
  ID: string,
  PAGINATION_LIMIT = 100
) => {
  let refreshToken = "";
  let sfwLinks = [];
  let nsfwLinks = [];
  let tweet_counter = 0;
  do {
    let batchResult = await FetchCurrentBatchTweetsById(ID, refreshToken);
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

  // Promise.all([first, second]).then
};

/** Obtains twitter user metadata for a username.
 *
 * @returns onject {id, name, username} or null */
export async function processTwitterUserByUsername(
  username: string
): Promise<{ id: string; name: string; username: string }> {
  let retval;
  await twitterAPI
    .GetMetaFromUsername(username)
    .then((res) => {
      console.log("User actually found");
      retval = res;
    })
    .catch((err) => {
      console.log(err);
    });
  return retval;
}

/** Removes dead links from an array of media links */
export function removeDeletedMediaLinks(links: string[]): string[] {
  return links.filter((e) => e != undefined);
}
