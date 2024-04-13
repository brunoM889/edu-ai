import { GoogleGenerativeAI } from "@google/generative-ai"

const gemini= new GoogleGenerativeAI(process.env.API_KEY);

const model = gemini.getGenerativeModel({ model: "gemini-pro"});

export default model