import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req) {
    const { prompt } = await req.json()
    try {
        const result = streamText({
            model: groq("openai/gpt-oss-20b"),
            prompt,
        })
        return result.toTextStreamResponse();
console.log("i should not run");
    } catch (e) {
        console.error(e)
        return Response.json(
             { error: "Failed to generate response" },
      { status: 500 }
        );
    }
}