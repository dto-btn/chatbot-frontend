import { useMemo } from "react";
import { ITooltipProps, Stack } from "@fluentui/react";
import DOMPurify from "dompurify";

import styles from "./Answer.module.css";

import { AskResponse, getCitationFilePath } from "../../api";
import { parseAnswerToHtml } from "./AnswerParser";
import { AnswerIcon } from "./AnswerIcon";

import { useTranslation } from "react-i18next";

import { IIconProps } from '@fluentui/react';
import { IconButton } from '@fluentui/react/lib/Button';

import { useBoolean } from '@fluentui/react-hooks';

interface Props {
    answer: AskResponse;
    isSelected?: boolean;
    onCitationClicked: (filePath: string) => void;
    onThoughtProcessClicked: () => void;
    onSupportingContentClicked: () => void;
    onFollowupQuestionClicked?: (question: string) => void;
    showFollowupQuestions?: boolean;
}

const sourceIcon: IIconProps = { iconName: 'Source'};
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

    const [toggleMenu, {toggle: toggleMenuVisiblity }] = useBoolean(false);

    return (
        <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between" onMouseEnter={() => toggleMenuVisiblity()} onMouseLeave={() =>  toggleMenuVisiblity()}>
            <Stack.Item>
                <Stack horizontal horizontalAlign="space-between">
                    <AnswerIcon />
                    {toggleMenu ?
                    (<div className={styles.sourcesContainer}>
                        <IconButton iconProps={like} className={styles.menuIcons} />
                        <IconButton iconProps={dislike} className={styles.menuIcons} /> 
                        <IconButton iconProps={copy} onClick={() => navigator.clipboard.writeText(sanitizedAnswerHtmlPre)} className={styles.menuIcons} />
                        <IconButton iconProps={sourceIcon} allowDisabledFocus disabled={!answer.metadata} onClick={() => onSupportingContentClicked()} title={t("supporting")} ariaLabel={t("supporting")} className={styles.menuIcons} />
                    </div>) : null}
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
    );
};
