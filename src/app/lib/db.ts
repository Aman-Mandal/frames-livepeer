import { Redis } from "@upstash/redis";

const client = new Redis({
  //@ts-ignore
  url: process.env.NEXT_PUBLIC_REDIS_URL,
  token: process.env.NEXT_PUBLIC_REDIS_TOKEN,
});

export { client };
