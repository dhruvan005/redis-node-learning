import client from './client.js';

// we can use list as a stack and queues

// For the stack 
// insert from left  -> lpush()
// rempove from left -> lpop()

// For creating the queues
// insert from left  -> lpush()
// remove form right -> rpop()

async function init() {
  // adding the element ot the list 
  const res1 = await client.lpush('bikes:repairs', 'bike:1');
  console.log(res1);  // 1

  const res2 = await client.lpush('bikes:repairs', 'bike:2');
  console.log(res2);  // 2


  // running the loop on list
  const res5 = await client.lrange('bikes:repairs', 0, -1);
  console.log(res5)

  const res3 = await client.rpop('bikes:repairs');
  console.log(res3) // -> removes the bike:1

  const res4 = await client.rpop('bikes:repairs');
  console.log(res4)  // -> removes the bike:2


  const res48 = await client.lPush(
    'bikes:repairs', ['bike:1', 'bike:2', 'bike:3', 'bike:4', 'bike:5']
  );
  console.log(res48);  // 5

  const res49 = await client.lTrim('bikes:repairs', 0, 2);
  console.log(res49);  // 'OK'
}


init();



