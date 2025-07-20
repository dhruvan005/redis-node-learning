import client from './client.js';
import express, { response } from 'express';
import axios from 'axios';

const app = express();

app.use(express.json());

app.get('/' , async (req , res) => {
  const cachedValue = await client.get("todos");

  if(cachedValue){
    // when we retrive the data from the redis the data is the form of the string we have to parce the data to json and then pass to the response 
    return res.json(JSON.parse(cachedValue))
  }
  const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
  // adding the data from the response and convert to string 
  await client.set("todos" , JSON.stringify(response.data));
  // in this we can set expire in this key 
  await client.expire("todos" , 60);
  return res.json(response.data);
})

app.listen(3000 , () => {
  console.log(`Server is runnig on http://localhost:3000/`)
});
