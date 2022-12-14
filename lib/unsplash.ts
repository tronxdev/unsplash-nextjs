import { createApi } from 'unsplash-js';

const ACCESS_KEY: string = process.env.UNSPLASH_ACCESS_KEY as string;

export default createApi({
  accessKey: ACCESS_KEY,
});
