import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

/** Builds an axios client */
const MakeLocalClient = () => {
  return axios.create({
    baseURL: `https://127.0.0.1:${process.env.SERVER_PORT}`,
  });
};

type youtubeRequestResponse = {
  id: string;
  query: string;
  status: string;
  completed_file: string;
};

/** Query to add a video request to queue (if not already exists) */
export const addRequest = (link: string) => {
  MakeLocalClient()
    .put<youtubeRequestResponse>(`/youtube/requests/${link}`)
    .then((res) => {
      if (res.status == 409) {
        // file already processes
        if (res.data.status != "completed")
          return { completed: true, download_path: res.data.completed_file };
        else
          return { completed: false, download_path: res.data.completed_file };
      }
    });
};
