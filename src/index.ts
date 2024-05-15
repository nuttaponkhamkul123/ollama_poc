


import { askQuestion, startOllama } from './langchain/ollama/prompts/prompts.js';
import { initialEmbeddings } from './langchain/embedding/embedded_langchain.js';
import express from 'express';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json())
const vectorsStore = await initialEmbeddings();
const client = createClient().on('error', (err) => console.error('REDIS ERROR', err))
await client.connect();




app.get('/', async (req, res) => {
    //NEED MORE VALIDATION DATA TO IDENTIFY
    let session = req.header('sessionID');
    if (!session) session = uuidv4();
    let currentSession = session
    const input = req.body['input'];
    const result = await askQuestion(currentSession + '_' + 'userSession', input, vectorsStore, client);
    res.setHeader('sessionID', session)
    res.send(result);
})


app.get('chat/:sessionId', async (req, res) => {
    //NEED MORE VALIDATION DATA TO IDENTIFY
    let session = req.header('sessionID');
    if (!session) session = uuidv4();
    let currentSession = session
    const input = req.body['input'];
    const result = await askQuestion(currentSession + '_' + 'userSession', input, vectorsStore, client);
    res.setHeader('sessionID', session)
    res.send(result);
})

app.listen(3000, async () => {
    console.log('PORT LISTENING ON 3000')
    await startOllama();
})




