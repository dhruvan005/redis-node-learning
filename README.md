## REDIS

This repository contains a simple Express server that uses Redis for caching and Axios for making HTTP requests. The server retrieves a list of todos from a Redis cache or fetches them from an external API if they are not cached.

### Endpoints

- `GET /api/posts`: Retrieve a list of todos
<!-- 
[Notes - Basic Redis Commands](https://www.notion.so/Redis-234c302d66e2805f9456c1fb00d58bcf) -->

http://localhost:3000/api/posts?q=Quick&take=10&skip=100&published=true

Load Testing the endpoint with autocannon:

```bash
autocannon -c 100 -d 10 -p 10 http://localhost:3000/api/posts?q=Quick&take=10&skip=100&published=true
```


