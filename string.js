import client from './client.js';

async function init() {
  // GET and SET commands
  await client.set("user:1", "Hp"); // if user:1 is not in redis then it creates new , otherwise it gives null
  const result = await client.get("user:1");
  // await client.expire("user:1" , 10); --> after the ten second the value will be null
  console.log(result);

  // SETNX stores a string value only if the key doesn't already exist. Useful for implementing locks.
  await client.setnx("user:1", "Apple");

  // Increment commands
  await client.set("total_crashes", 0);
  const res7 = await client.incr("total_crashes");
  console.log(res7); // 1
  const res8 = await client.incrBy("total_crashes", 10);
  console.log(res8); // 11

  // Multiple SET and GET
  const res5 = await client.mSet([
    ["bike:1", "Deimos"],
    ["bike:2", "Ares"],
    ["bike:3", "Vanth"]
  ]);

  console.log(res5);  // OK
  const res6 = await client.mGet(["bike:1", "bike:2", "bike:3"]);
  console.log(res6);  // ['Deimos', 'Ares', 'Vanth']
}
init();