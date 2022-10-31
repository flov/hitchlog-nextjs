import { Comment } from './Comment';

export type Post = {
  id: number;
  title: string;
  body: string;
  user_id: number;
  tag: string;
  updated_at: string;
  created_at: string;
  to_param: string;
  summary: string;
  author: {
    username: string;
    name: string;
    avatar_url: string;
  };
  comments: Comment[];
};
