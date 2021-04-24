import * as twitUtil from "../twitterUtility";

// Settings
const DEFAULT_TWEET_LIMIT = 100;
const DEFAULT_TWEETS_PER_PAGE = 100;

/**Scrapes image links for a given twitter username
 *  @returns {sfw: string[], nsfw: string[]}
 */
export const scrapeByTwitterID = async (
  ID: string
): Promise<{ sfw: string[]; nsfw: string[] }> => {
  // Generate the necessary temporary files
  let refreshToken = "";
  let sfwLinks: string[] = [],
    nsfwLinks: string[] = [];
  let tweet_counter = 0;
  let retval: { sfw: string[]; nsfw: string[] };

  do {
    let batchResult = await twitUtil.FetchCurrentBatchTweetsById(
      ID,
      refreshToken
    );
    console.log(`Fetching page ${tweet_counter / DEFAULT_TWEETS_PER_PAGE + 1}`);

    const { data, refresh_token } = batchResult;
    // Determine the set of sfw, nsfw and og content
    let sfw = data
      .filter((ele) => !ele.possibly_sensitive)
      .map((ele) => ele.id);
    let nsfw = data
      .filter((ele) => ele.possibly_sensitive)
      .map((ele) => ele.id);

    // Contat the results for next pagination attempt
    sfwLinks = sfwLinks.concat(sfw);
    nsfwLinks = nsfwLinks.concat(nsfw);
    tweet_counter += DEFAULT_TWEETS_PER_PAGE;
    refreshToken = refresh_token;
  } while (refreshToken != "" && tweet_counter < DEFAULT_TWEET_LIMIT);

  console.log(nsfwLinks.length, sfwLinks.length);

  // Fetch image links for SFW/NSFW tagged images
  let first = twitUtil.FetchImageLinksForTweets(sfwLinks, "sfw", 20);
  let second = twitUtil.FetchImageLinksForTweets(nsfwLinks, "nsfw", 20);

  await Promise.all([first, second])
    .then(([resultFirst, resultSecond]) => {
      retval = { sfw: resultFirst, nsfw: resultSecond };
    })
    .catch((err) => {
      console.log(err);
    });

  return retval;
};
