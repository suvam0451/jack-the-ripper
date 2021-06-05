export type IGelbooruSearch = {
  id: number;
  count: number;
  tag: string;
};

export type ITweetsSearch = {
  sfw?: string[];
  nsfw?: string[];
  all?: string[];
  username: string;
};

export type IGelbooruImageSearchResults = {
    owner: string;
    file_url: string;
    id: string;
    title: string;
    rating: string;
};
