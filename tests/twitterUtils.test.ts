import * as twitterUtil from "../src/twitterUtility";
// Mock axios
import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

function dummyEndpoint(count: number, pagination: boolean) {
  let dataObject = [];
  for (let i = 0; i < count; i++) {
    dataObject = dataObject.concat({ id: i, possibly_sensisitive: i % 2, text: "random" });
  }
  return {data: dataObject, meta: {
    oldest_id: "",
    newest_id: "",
    result_count: 100,
    next_token: pagination ? "next_token" : "",
  }}
}

it("calls /users/:id/tweets once for upto 100 tweets", () => {
  mockedAxios.get.mockResolvedValue({ data: dummyEndpoint(70, false) });
  mockedAxios.create.mockImplementation((config) => axios);
  twitterUtil.FetchCurrentBatchTweetsById("828600385820516352", "ok");
  expect(mockedAxios.get).toHaveBeenCalledTimes(1);
});

// it("divides tweet ids into chunks and fetches media links for each set", ()=> {
//     // Mocks
//     let stup = jest.fn(twitterUtil.FetchImageLinksForTweets_Helper)

//     // random string array with higher sampling size than that of specimen function
//     let sample = Array.from({length: 60}, () => (Math.floor(Math.random() * 40)).toString());
//     twitterUtil.FetchImageLinksForTweets(sample, 50)
//     expect(stup).toHaveBeenCalledTimes(2)
// })