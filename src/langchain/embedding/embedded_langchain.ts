
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const initialEmbeddings = async () => {
    const embeddings = new OllamaEmbeddings({
        model: "llama3", // default value
        baseUrl: "http://localhost:11434", // default value
        requestOptions: {
            // useMMap: true,
            numThread: 6,
            numGpu: 1,
        },
    });
    const splitter = new RecursiveCharacterTextSplitter({
        chunkOverlap: 3,
    });
    const arrayDocs = ["Hello World!", "Bye Bye", "I am nuttapon khamkul", "hwhweer"];
    const splittedDocs = await splitter.createDocuments(arrayDocs);

    console.log('splittedDocs', splittedDocs)
    const vector = await MemoryVectorStore.fromDocuments(splittedDocs, embeddings)
    return vector;
}



