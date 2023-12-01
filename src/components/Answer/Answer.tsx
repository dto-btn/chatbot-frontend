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
import QuestionAnswered from "./QuestionNotAnswered";
import QuestionNotAnswered from "./QuestionNotAnswered";


interface Props {
    answer: AskResponse;
    question: string;
    isSelected?: boolean;
    toggleSource?: boolean;
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
    toggleSource,
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
    const Rexp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
    const sanitizedAnswerHtml = sanitizedAnswerHtmlPre.replace(Rexp, "<a href='$1' target='_blank'>$1</a>");

    const { t } = useTranslation();

    const [toggleMenu, {toggle: toggleMenuVisiblity }] = useBoolean(false);

    return (
        <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between" onMouseEnter={() => toggleMenuVisiblity()} onMouseLeave={() =>  toggleMenuVisiblity()}>
            <Stack.Item>
                <Stack horizontal horizontalAlign="space-between">
                    <AnswerIcon />
                    {toggleMenu ?
                    (<div className={styles.sourcesContainer}>
                        <IconButton iconProps={like} className={styles.menuIcons} title={t("like")} ariaLabel={t("like")} onClick={() => onFeedbackClicked(FeedbackType.Like)}/>
                        <IconButton iconProps={dislike} className={styles.menuIcons} title={t("dislike")} ariaLabel={t("dislike")}  onClick={() => onFeedbackClicked(FeedbackType.Dislike)}/> 
                        <IconButton iconProps={copy} onClick={() => navigator.clipboard.writeText(sanitizedAnswerHtmlPre)} className={styles.menuIcons} title={t("copy")} ariaLabel={t("copy")} />
                        <IconButton iconProps={sourceIcon} allowDisabledFocus disabled={!answer.metadata} onClick={() => {onSupportingContentClicked();}} title={t("sources")} ariaLabel={t("sources")} className={styles.menuIcons} />
                    </div>) : null || 
                    toggleSource ?
                    (<div className={styles.sourcesContainer}>
                        <IconButton iconProps={sourceIcon} allowDisabledFocus disabled={!answer.metadata} onClick={() => {onSupportingContentClicked();}} title={t("sources")} ariaLabel={t("sources")} className={styles.menuIcons} />
                    </div>): null}
                </Stack>
            </Stack.Item>

            <Stack.Item grow>
                <div className={styles.answerText} dangerouslySetInnerHTML={{ __html: sanitizedAnswerHtml }}></div>
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
