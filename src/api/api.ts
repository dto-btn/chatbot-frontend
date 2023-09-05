import { AskRequest, AskResponse, ChatRequest, FeedbackItem } from "./models";

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
            index: "2023-07-19",
            chat_history: options.chat_history
        })
    });

    const parsedResponse: AskResponse = await response.json();
    if (response.status > 299 || !response.ok) {
        throw Error(parsedResponse.error || "Unknown error");
    }

    return parsedResponse;
}

export function getCitationFilePath(citation: string): string {
    return `/content/${citation}`;
}

export async function sendFeedback(feedback: FeedbackItem, lang: string): Promise<AskResponse> {
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

    const parsedResponse: AskResponse = await response.json();
    if (response.status > 299 || !response.ok) {
        throw Error(parsedResponse.error || "Unknown error");
    }

    return parsedResponse;
}
