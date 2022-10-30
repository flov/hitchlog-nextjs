export type Comment = {
  body: string;
  created_at: string;
  author: {
    username: string;
    name: string;
    avatar_url: string;
  }
};