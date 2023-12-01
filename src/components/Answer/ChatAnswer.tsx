import { Stack } from "@fluentui/react";

import styles from "./Answer.module.css";

import { ChatResponse } from "../../api";


import { IIconProps } from '@fluentui/react';

import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface Props {
    answer: ChatResponse;
    isSelected?: boolean;
}

const sourceIcon: IIconProps = { iconName: 'Source'};
const like: IIconProps = { iconName: 'Like' };
const dislike: IIconProps = { iconName: 'Dislike' };
const copy: IIconProps = { iconName: 'Copy'}

export const ChatAnswer = ({
    answer,
    isSelected,
}: Props) => {

    return (
        <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between">
            <Stack.Item grow>
            <Markdown
                remarkPlugins={[[remarkGfm, {singleTilde: false}]]}
                children={answer.message.content}
                components={{
                code(props) {
                    const {ref, children, className, node, ...rest} = props
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                    <SyntaxHighlighter
                        {...rest}
                        PreTag="div"
                        children={String(children).replace(/\n$/, '')}
                        language={match[1]}
                        style={a11yDark}
                    />
                    ) : (
                    <code {...rest} className={className}>
                        {children}
                    </code>
                    )
                }
                }}
            />
            </Stack.Item>
        </Stack>
    );
};
