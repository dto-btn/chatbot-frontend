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
    GPT_35_TURBO_16K = "gpt_35_turbo_16k",
    GPT_4 = "gpt_4"
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
    model: Model;
    responseMode: ResponseMode
};

export type FeedbackItem = {
    text?: string;
    type: FeedbackType;
    index: number;
    answers?: [user: string, response: AskResponse][];
};
