import axios from "axios";
import * as dotenv from "dotenv";

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
      Authorization:
        `Bearer ${process.env.DISCORD_BEARER}`,
    },
    baseURL: "https://api.twitter.com/2",
  });
};

/** Helper function that actually converts the array of ids to a string request
 *  and fetches results */
const FetchImageLinksForTweets_Helper = async (tweet_ids: string[]) => {
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
    const lines = res.data.includes.media.map((ele) => ele.url);
    return lines;
  } else {
    let err: string[] = [];
    return err;
  }
};

/** Retrieves image links attached to tweet(s)
 *  @param batchSize chunk entries into batches and produce appended result
 */
export const FetchImageLinksForTweets = async (
  tweet_ids: string[],
  batchSize?: number
) => {
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
      console.log(BATCH_PROGRESS);
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
