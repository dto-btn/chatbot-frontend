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

export const enum ResponseMode {
    TreeSumarize = "tree_sumarize",
    SimpleSumarize = "simple_sumarize",
    Refine = "refine",
    Compact = "compact",
    Accumulate = "accumulate",
    CompactAccumulate = "compact_accumulate"
}

export const enum Model {
    GPT_4 = "gpt-4"
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
        date: string;
        url?: string;
        text: string[];
        node_scores: number[];
        source: string;
        title: string;
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
    model: Model;
    responseMode: ResponseMode;
    numCount: number
};

export type ChatAllRequest = {
    query: string;
    history?: ChatHistory[];
    prompt?: string;
    tokens?: number;
    temp?: number;
    past_msg_incl?: number
};

export type FeedbackItem = {
    text?: string;
    type: FeedbackType;
    index: number;
    answers?: [user: string, response: AskResponse][];
};

export type ChatHistory = {
    role: string;
    content: string;
};

export type Message = {
    content: string;
    role: string;
};

export type Choice = {
    finish_reason: string;
    index: number;
    message: Message;
};

export type Usage = {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
};

export type Response = {
    choices: Choice[];
    created: number;
    history: ChatHistory[];
    id: string;
    model: string;
    object: string;
    usage: Usage;
};