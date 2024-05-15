
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ConversationChain } from 'langchain/chains';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { initialOllama } from '../ollama.js';
import { RedisChatMessageHistory } from '@langchain/redis';
import { RunnableWithMessageHistory } from "langchain/runnables";
// you are AI that a little bit shy and you don't want to talk too much.
const SYSTEM_TEMPLATE = `Answer the user's questions.
        If you don't know just say "I DONT KNOW"
        {history}
        Question : {input}
        `;
let ollama = null; 

// ChatPromptTemplate.fromMessages([["ai", SYSTEM_TEMPLATE]])
let conversationChain : ConversationChain = null


export const startOllama = async () => {
    ollama = await initialOllama();
}

export const getRedisMemory = async (sessionID, client) => {
    const h = new RedisChatMessageHistory({
        sessionId: sessionID,
        sessionTTL: 3600,
        client
    })
    const messages = await h.getMessages();
    return { instance: h, messages }
}


export const askQuestion = async (sessionID, input, vectorsStore, client) => {

    const instruction= `Answer the user's questions.
    If you don't know just say "I DONT KNOW"`
    // new MessagesPlaceholder("history")
    let prompt = ChatPromptTemplate.fromMessages([  ["system", instruction] , ['user' , '{input}'] , new MessagesPlaceholder("history") ])
    
    const { instance, messages } = await getRedisMemory(sessionID, client);
    const memory = new BufferMemory({ returnMessages : true , inputKey: 'input', memoryKey: 'history' , chatHistory: instance })

    conversationChain = new ConversationChain({
        llm: ollama,
        memory,
        prompt,
    })
    const stream = await conversationChain.invoke({ input })
    return stream;
};


