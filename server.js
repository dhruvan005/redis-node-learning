import client from './client.js';
import express, { response } from 'express';
import axios from 'axios';
import prisma from './db.js';

const app = express();

app.use(express.json());

function constructKey(req) {
  // came as /api/posts
  const baseUrl = req.path.replace(/^\/+|\/+$/g, '').replace(/\//g, ':');
  // baseUrl will be api:posts
  const parems = req.query;
  // Object.keys , it take only keys from the query like (q, skip, take, etc)
  const sortedParems = Object.keys(parems)
    .sort()
    .map((key) => `${key}=${parems[key]}`)
    .join("&");

  return sortedParems ? `${baseUrl}:${sortedParems}` : baseUrl;
}

app.get('/api/posts', async (req, res) => {

  const { q, take, skip, published } = req.query;

  // check if key exist in cache
  const KEY = constructKey(req);
  // requested URL : http://localhost:3000/api/posts?q=Node.js&take=100&skip=0&published=true
  // constructed Key from that - key :  api:posts:published=true&q=Node.js&skip=0&take=100
  console.log("key : ", KEY)
  const data = await client.get(KEY);

  if (data) {
    console.log("Cache Hit")
    return res.json(JSON.parse(data))
  }

  console.log("Cache Miss")



  const posts = await prisma.post.findMany({
    take: Number(take),
    skip: Number(skip),
    orderBy: {
      id: 'desc',
    },
    include: {
      author: {
        include: {
          profile: true,
        },
      },
    },
    where: {
      published: published ? published === 'true' : undefined,
      title: q ? {
        contains: q,
        mode: 'insensitive',
      } : undefined,
    },
  });

  await client.set(KEY, JSON.stringify(posts), 'EX', 60, 'NX')

  res.json({ posts: posts, total: posts.length })
})


// when the new post is created then we delete that data from that cache for maintaining consistency

// Helper function to invalidate all posts cache
// client.keys return all the matching pattern in redis-db 
async function invalidatePostsCache() {
  const keys = await client.keys('api:posts:*');
  if (keys.length > 0) {
    await client.del(...keys);
    console.log(`Invalidated ${keys.length} cache keys`);
  }
}

// Helper function to invalidate all posts cache using SCAN (non-blocking, production-safe)
// O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection.
async function invalidatePostsCacheSCAN() {
  let cursor = '0';
  let totalDeleted = 0;

  do {
    // SCAN is non-blocking - iterates through keys in batches
    // COUNT 100 means process ~100 keys per iteration
    const [newCursor, keys] = await client.scan(cursor, 'MATCH', 'api:posts:*', 'COUNT', 100);
    cursor = newCursor;

    if (keys.length > 0) {
      await client.del(...keys);
      totalDeleted += keys.length;
    }
  } while (cursor !== '0'); // cursor returns to '0' when scan is complete

  if (totalDeleted > 0) {
    console.log(`Invalidated ${totalDeleted} cache keys`);
  }
}

app.post('/api/post', async (req, res) => {
  const { title, content, authorId, published } = req.body;

  const post = await prisma.post.create({
    data: { title, content, authorId, published }
  })

  // Invalidate all posts from redis
  await invalidatePostsCache();

  res.json(post);
})

app.listen(3000, () => {
  console.log(`Server is runnig on http://localhost:3000/`)
});
