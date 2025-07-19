import client from './client.js';

async function init() {
  // await client.setnx("user:4" , "Hp"); // if user:4 is not in redis then it creates new , otherwise it gives null
  const result = await client.get("user:4");
  // await client.expire("user:4" , 10); --> after the ten second the value will be null
  console.log(result);
}
init();