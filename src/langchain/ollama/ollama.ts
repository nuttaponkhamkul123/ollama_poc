
import { Ollama } from "@langchain/community/llms/ollama";
export const initialOllama = async () => {
    const ollama = new Ollama({
        baseUrl: "http://localhost:11434",
        model: "llama3",
        headers: {
            "test": "123213",
        },
    })

    return ollama;
}

