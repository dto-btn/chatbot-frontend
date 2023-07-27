import { AskRequest, AskResponse, ChatRequest } from "./models";

export async function askApi(options: AskRequest): Promise<AskResponse> {
    const response = await fetch("/query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: options.question,
            temp: options.overrides?.temperature,
            k: options.overrides?.top,
            lang: "en",
            pretty: "true",
            index: "2023-07-19",
        })
    });

    const parsedResponse: AskResponse = await response.json();
    if (response.status > 299 || !response.ok) {
        throw Error(parsedResponse.error || "Unknown error");
    }

    return parsedResponse;
}

export async function chatApi(options: ChatRequest): Promise<AskResponse> {
    const response = await fetch("/query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: options.question,
            temp: options.overrides?.temperature,
            k: options.overrides?.top,
            lang: "en",
            pretty: "true",
            index: "2023-07-19",
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
