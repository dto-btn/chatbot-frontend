import { FeedbackType } from "../components/Feedback/FeedbackType";

export const enum Approaches {
    RetrieveThenRead = "rtr",
    ReadRetrieveRead = "rrr",
    ReadDecomposeAsk = "rda"
}

export const enum RetrievalMode {
    Hybrid = "hybrid",
    Vectors = "vectors",
    Text = "text"
}

export type AskRequestOverrides = {
    retrievalMode?: RetrievalMode;
    semanticRanker?: boolean;
    semanticCaptions?: boolean;
    excludeCategory?: string;
    top?: number;
    temperature?: number;
    promptTemplate?: string;
    promptTemplatePrefix?: string;
    promptTemplateSuffix?: string;
    suggestFollowupQuestions?: boolean;
};

export type AskRequest = {
    question: string;
    approach: Approaches;
    overrides?: AskRequestOverrides;
};

export type AskResponse = {
    answer: string;
    chat_history: string;
    logs?: string[];
    error?: string;
    metadata: ResponseMetadata;
};

export type ResponseMetadata = {
    [key: string]: {
        filename: string;
        lastmodified: string;
        url?: string;
        text: string[];
        node_scores: number[];
        source: string;
    };
};

export type ChatTurn = {
    user: string;
    bot?: string;
};

export type ChatRequest = {
    question: string;
    chat_history: string;
    history: ChatTurn[];
    approach: Approaches;
    overrides?: AskRequestOverrides;
};

export type FeedbackItem = {
    text?: string;
    type: FeedbackType;
    index: number;
    answers?: [user: string, response: AskResponse][];
};
