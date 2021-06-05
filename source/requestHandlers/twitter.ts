import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

/** Builds an axios client */
const MakeTwitterClient = () => {
  return axios.create({
    headers: {
      Authorization: `Bearer ${process.env.DISCORD_BEARER}`,
    },
    baseURL: "https://api.twitter.com/2",
  });
};

export const GetMetaFromUsername = async (username: string) => {
  let res = await MakeTwitterClient().get<UserMetaData>(
    `users/by/username/${username}`
  );
  console.log(res.status);
  if (res.status != 200 || res.data.errors) {
    return null;
  }
  return res.data.data;
};

type UserMetaData = {
  data?: {
    id: string;
    name: string;
    username: string;
  };
  errors?: {
    value: string;
    detail: string;
    title: string;
    resource_type: string;
    parameter: string;
    resource_id: "syannhaine";
    type: "https://api.twitter.com/2/problems/resource-not-found";
  };
};
