import { useMemo } from "react";
import { ITooltipProps, Stack } from "@fluentui/react";
import DOMPurify from "dompurify";

import styles from "./Answer.module.css";

import { AskResponse, ChatResponse, getCitationFilePath } from "../../api";
import { parseAnswerToHtml } from "./AnswerParser";
import { AnswerIcon } from "./AnswerIcon";

import { useTranslation } from "react-i18next";

import { IIconProps } from '@fluentui/react';
import { IconButton } from '@fluentui/react/lib/Button';

import { useBoolean } from '@fluentui/react-hooks';
import { FeedbackType } from "../Feedback/FeedbackType";


interface Props {
    answer: ChatResponse;
    isSelected?: boolean;
    onFollowupQuestionClicked?: (question: string) => void;
}

const sourceIcon: IIconProps = { iconName: 'Source'};
const like: IIconProps = { iconName: 'Like' };
const dislike: IIconProps = { iconName: 'Dislike' };
const copy: IIconProps = { iconName: 'Copy'}

export const ChatAnswer = ({
    answer,
    isSelected,
    onFollowupQuestionClicked,
}: Props) => {
    const parsedAnswer = useMemo(() => parseAnswerToHtml(answer.choices[0].message.content, () => {}), [answer]);
    const sanitizedAnswerHtmlPre = DOMPurify.sanitize(parsedAnswer.answerHtml);
    const Rexp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
    const sanitizedAnswerHtml = sanitizedAnswerHtmlPre.replace(Rexp, "<a href='$1' target='_blank'>$1</a>");

    const { t } = useTranslation();

    const [toggleMenu, {toggle: toggleMenuVisiblity }] = useBoolean(false);

    return (
        <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between">
            <Stack.Item grow>
                <div className={styles.answerText} dangerouslySetInnerHTML={{ __html: sanitizedAnswerHtml }}></div>
            </Stack.Item>
        </Stack>
    );
};
