import { useMemo } from "react";
import { DirectionalHint, ITooltipProps, Stack, TooltipDelay, TooltipHost } from "@fluentui/react";
import DOMPurify from "dompurify";

import styles from "./Answer.module.css";

import { AskResponse, getCitationFilePath } from "../../api";
import { parseAnswerToHtml } from "./AnswerParser";
import { AnswerIcon } from "./AnswerIcon";

import { useTranslation } from "react-i18next";

import { IIconProps } from '@fluentui/react';
import { ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { useId } from '@fluentui/react-hooks';

interface Props {
    answer: AskResponse;
    isSelected?: boolean;
    onCitationClicked: (filePath: string) => void;
    onThoughtProcessClicked: () => void;
    onSupportingContentClicked: () => void;
    onFollowupQuestionClicked?: (question: string) => void;
    showFollowupQuestions?: boolean;
}

const sourceIcon: IIconProps = { iconName: 'Source' };
const like: IIconProps = { iconName: 'Like' };
const dislike: IIconProps = { iconName: 'Dislike' };
const copy: IIconProps = { iconName: 'Copy'}

export const Answer = ({
    answer,
    isSelected,
    onCitationClicked,
    onThoughtProcessClicked,
    onSupportingContentClicked,
    onFollowupQuestionClicked,
    showFollowupQuestions
}: Props) => {
    const parsedAnswer = useMemo(() => parseAnswerToHtml(answer.answer, onCitationClicked), [answer]);
    const sanitizedAnswerHtmlPre = DOMPurify.sanitize(parsedAnswer.answerHtml);
    const Rexp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
    const sanitizedAnswerHtml = sanitizedAnswerHtmlPre.replace(Rexp, "<a href='$1' target='_blank'>$1</a>");

    const { t } = useTranslation();

    // Use useId() to ensure that the ID is unique on the page.
    // (It's also okay to use a plain string and manually ensure uniqueness.)
    const tooltipId = useId('tooltip');

    const tooltipProps: ITooltipProps = {
        onRenderContent: () => (
            <div>
                <IconButton iconProps={like} />
                <IconButton iconProps={dislike} /> 
                <IconButton iconProps={copy} />
            </div>
        ),
    };

    return (
        <TooltipHost id={tooltipId} tooltipProps={tooltipProps} directionalHint={DirectionalHint.rightTopEdge} closeDelay={3000} delay={TooltipDelay.medium}>
            <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between">
                <Stack.Item>
                    <Stack horizontal horizontalAlign="space-between" aria-describedby={tooltipId}>
                        <AnswerIcon />
                        <div className={styles.sourcesContainer}>
                            {/* <IconButton
                                style={{ color: "black" }}
                                iconProps={{ iconName: "Lightbulb" }}
                                title="Show thought process"
                                ariaLabel="Show thought process"
                                onClick={() => onThoughtProcessClicked()}
                                disabled={!answer.thoughts}
                            /> */}

                            <ActionButton iconProps={sourceIcon} allowDisabledFocus disabled={!answer.metadata} onClick={() => onSupportingContentClicked()} title={t("supporting")} ariaLabel={t("supporting")}>
                            Source(s)
                            </ActionButton>
                        </div>
                    </Stack>
                </Stack.Item>

                <Stack.Item grow>
                    <div className={styles.answerText} dangerouslySetInnerHTML={{ __html: sanitizedAnswerHtml }}></div>
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
        </TooltipHost>
    );
};
