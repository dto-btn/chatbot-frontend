import { AskRequest, AskResponse, ChatAllRequest, ChatRequest, ChatResponse, FeedbackItem } from "./models";

export async function askApi(options: AskRequest, lang: string): Promise<AskResponse> {
    const response = await fetch("/query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: options.question,
            temp: options.overrides?.temperature,
            k: options.overrides?.top,
            lang: lang,
            pretty: 0,
            index: "2023-07-19",
        })
    });

    const parsedResponse: AskResponse = await response.json();
    if (response.status > 299 || !response.ok) {
        throw Error(parsedResponse.error || "Unknown error");
    }

    return parsedResponse;
}

export async function chatApi(options: ChatRequest, lang: string): Promise<AskResponse> {
    const response = await fetch("/query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: options.question,
            temp: options.overrides?.temperature,
            k: options.overrides?.top,
            lang: lang,
            pretty: 0,
            response_mode: options.responseMode,
            model: options.model,
            chat_history: options.chat_history,
            num_output: options.numCount
        })
    });

    const parsedResponse: AskResponse = await response.json();
    if (response.status > 299 || !response.ok) {
        throw Error(parsedResponse.error || "Unknown error");
    }

    return parsedResponse;
}

export async function chatApiAll(options: ChatAllRequest): Promise<ChatResponse> {
    const response = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: options.query,
            history: options.history,
            prompt: options.prompt,
            tokens: options.tokens,
            temp: options.temp,
            past_msg_incl: options.past_msg_incl
        })
    });

    const parsedResponse: ChatResponse = await response.json();
    if (response.status > 299 || !response.ok) {
        throw Error("Unknown error");
    }

    return parsedResponse;
}

export function getCitationFilePath(citation: string): string {
    return `/content/${citation}`;
}

export async function sendFeedback(feedback: FeedbackItem, lang: string): Promise<Response> {
    const response = await fetch("/feedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: feedback.text,
            type: feedback.type,
            index: feedback.index,
            answers: feedback.answers,
            lang: lang,
        })
    });

    if (response.status > 299 || !response.ok) {
        throw Error("Unknown error");
    }

    return response;
}
