import { useEffect, useMemo, useState } from "react";
import { ITooltipProps, Stack } from "@fluentui/react";
import DOMPurify from "dompurify";

import styles from "./Answer.module.css";

import { AskResponse, ChatAllRequest, chatApiAll, getCitationFilePath } from "../../api";
import { parseAnswerToHtml } from "./AnswerParser";
import { AnswerIcon } from "./AnswerIcon";

import { useTranslation } from "react-i18next";

import { IIconProps } from '@fluentui/react';
import { IconButton } from '@fluentui/react/lib/Button';

import { useBoolean } from '@fluentui/react-hooks';
import { FeedbackType } from "../Feedback/FeedbackType";
import QuestionNotAnswered from "./QuestionNotAnswered";

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
    answer: AskResponse;
    question: string;
    isSelected?: boolean;
    onCitationClicked: (filePath: string) => void;
    onThoughtProcessClicked: () => void;
    onSupportingContentClicked: () => void;
    onFollowupQuestionClicked?: (question: string) => void;
    showFollowupQuestions?: boolean,
    onFeedbackClicked: (type: FeedbackType) => void;
    questionAnswered: boolean;
    retryQuestion: (question: string) => void;
    askGPT: (question: string) => void;
}

const sourceIcon: IIconProps = { iconName: 'Source'};
const like: IIconProps = { iconName: 'Like' };
const dislike: IIconProps = { iconName: 'Dislike' };
const copy: IIconProps = { iconName: 'Copy'}

export const Answer = ({
    answer,
    question,
    isSelected,
    onCitationClicked,
    onThoughtProcessClicked,
    onSupportingContentClicked,
    onFollowupQuestionClicked,
    showFollowupQuestions,
    onFeedbackClicked,
    questionAnswered,
    retryQuestion,
    askGPT
}: Props) => {
    const parsedAnswer = useMemo(() => parseAnswerToHtml(answer.answer, onCitationClicked), [answer]);
    const sanitizedAnswerHtmlPre = DOMPurify.sanitize(parsedAnswer.answerHtml);

    const { t } = useTranslation();

    // Function to handle keydown events  
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {  
        // Check if the key pressed is 'Enter' or 'Space'  
        if ((event.key === 'Enter' || event.key === ' ')) {  
            event.preventDefault(); // Prevent the default action (e.g., scrolling when space is pressed)  
            navigator.clipboard.writeText(sanitizedAnswerHtmlPre)
        }  
    };

    return (
        <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between">
            <Stack.Item>
                <Stack horizontal horizontalAlign="space-between">
                    <AnswerIcon />
                    <div className={styles.sourcesContainer}>
                        <IconButton iconProps={like} className={styles.menuIcons} title={t("like")} ariaLabel={t("like")} onClick={() => onFeedbackClicked(FeedbackType.Like)}/>
                        <IconButton iconProps={dislike} className={styles.menuIcons} title={t("dislike")} ariaLabel={t("dislike")}  onClick={() => onFeedbackClicked(FeedbackType.Dislike)}/> 
                        <IconButton iconProps={copy} onClick={() => navigator.clipboard.writeText(sanitizedAnswerHtmlPre)} onKeyDown={handleKeyDown} className={styles.menuIcons} title={t("copy")} ariaLabel={t("copy")} />
                        <IconButton iconProps={sourceIcon} allowDisabledFocus disabled={!answer.metadata} onClick={() => {onSupportingContentClicked();}} title={t("sources")} ariaLabel={t("sources")} className={styles.menuIcons} />
                    </div>                      
                </Stack>
            </Stack.Item>

            <Stack.Item grow>
                <Markdown
                    remarkPlugins={[[remarkGfm, {singleTilde: false}]]}
                    children={answer.answer}
                />
            </Stack.Item>

            <Stack.Item grow>
                {!questionAnswered && <QuestionNotAnswered question={question} retryQuestion={retryQuestion} askGPT={askGPT}/>}
            </Stack.Item>

            {!!parsedAnswer.citations.length && (
                <Stack.Item>
                    <Stack horizontal wrap tokens={{ childrenGap: 5 }}>
                        <span className={styles.citationLearnMore}>Citations:</span>
                        {parsedAnswer.citations.map((x, i) => {
                            const path = getCitationFilePath(x);
                            return (
                                <a key={i} className={styles.citation} title={x} onClick={() => onCitationClicked(path)}>
                                    {`${++i}. ${x}`}
                                </a>
                            );
                        })}
                    </Stack>
                </Stack.Item>
            )}

            {!!parsedAnswer.followupQuestions.length && showFollowupQuestions && onFollowupQuestionClicked && (
                <Stack.Item>
                    <Stack horizontal wrap className={`${!!parsedAnswer.citations.length ? styles.followupQuestionsList : ""}`} tokens={{ childrenGap: 6 }}>
                        <span className={styles.followupQuestionLearnMore}>Follow-up questions:</span>
                        {parsedAnswer.followupQuestions.map((x, i) => {
                            return (
                                <a key={i} className={styles.followupQuestion} title={x} onClick={() => onFollowupQuestionClicked(x)}>
                                    {`${x}`}
                                </a>
                            );
                        })}
                    </Stack>
                </Stack.Item>
            )}
        </Stack>
    );
};
