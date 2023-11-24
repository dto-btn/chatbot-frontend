import { DefaultButton, Dropdown, IDropdownOption, IIconProps, IStackTokens, Panel, Slider, SpinButton, Stack, TextField } from "@fluentui/react";
import { useEffect, useRef, useState } from "react";
import styles from "./Any.module.css";

import { ChatAllRequest, ChatResponse, Model, chatApiAll } from "../../api";
import { AnswerError, AnswerLoading } from "../../components/Answer";
import { ClearChatButton } from "../../components/ClearChatButton";
import { QuestionInput } from "../../components/QuestionInput";
import { SettingsButton } from "../../components/SettingsButton";
import { UserChatMessage } from "../../components/UserChatMessage";

import React from "react";
import { useTranslation } from 'react-i18next';
import { ChatAnswer } from "../../components/Answer/ChatAnswer";
import { SparkleFilled } from "@fluentui/react-icons";
import { useLocation } from "react-router-dom";

const Any = () => {
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [tempCount, setTempCount] = useState<number>(0.7);
    const [maxHistory, setMaxHistory] = useState<number>(10);


    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<unknown>();

    const [answers, setAnswers] = useState<[user: string, response: ChatResponse][]>([]);

    const [model, setModel] = useState<Model>(Model.GPT_4);
    const [numCount, setNumCount] = useState<number>(800);

    const { t, i18n } = useTranslation();

    const [chatPrompt, setChatPrompt] = useState<string>(t("prompt.placeholder"));

    const stackTokens: IStackTokens = {
        childrenGap: 10,
    };

    const infoIcon: IIconProps = { iconName: 'Info' };

    const makeApiRequest = async (question: string, prompt?: string) => {

        lastQuestionRef.current = question;

        error && setError(undefined);
        setIsLoading(true);

        try {
            const request: ChatAllRequest = {
                query: question,
                history: answers.length > 0 && !prompt ? answers[answers.length-1][1].history : [],
                prompt: answers.length <= 0 || prompt ? (prompt ? prompt : chatPrompt) : "",
                tokens: numCount,
                temp: tempCount,
                past_msg_incl: maxHistory
            };
            const result = await chatApiAll(request);
            setAnswers([...answers, [question, result]]);
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setAnswers(a => []);
    };

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);

    const onTempCountChange = (_ev?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
        setTempCount(parseFloat(newValue || "0.7"));
    };

    const onModelChange = (_ev: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<Model> | undefined, index?: number | undefined) => {
        setModel(option?.data || Model.GPT_4);
    };

    const onNumCountChange = (value: number) => {
        setNumCount(value);
    };

    const onMaxHistoryChange = (value: number) => {
        setMaxHistory(value);
    };

    const onChatPromptChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        clearChat();
        if (!newValue) {
            setChatPrompt("");
        } else if (newValue.length <= 1000) {
            setChatPrompt(newValue);
        }
    };

    const runExample = (prompt: string, query: string) => {
        clearChat();
        setChatPrompt(prompt);
        makeApiRequest(query, prompt);
    }

    const EXAMPLES: {summary: string, prompt: string, query: string}[] = [
        { summary: t('gpt-ex1-s'), prompt: t('gpt-ex1-p'), query: t('gpt-ex1-q') },
        { summary: t('gpt-ex2-s'), prompt: t('gpt-ex2-p'), query: t('gpt-ex2-q') },
        { summary: t('gpt-ex3-s'), prompt: t('gpt-ex3-p'), query: t('gpt-ex3-q') }
    ];

    let location = useLocation();
    useEffect(() => {
        const data = location.state;
        if(data?.question){
            makeApiRequest(data.question);
        }
    }, [location.state])

    return (

        <div className={styles.container}>
            <div className={styles.commandsContainer}>
                <ClearChatButton className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading} />
                <SettingsButton className={styles.commandButton} onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)} />
            </div>
            <div className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                    {!lastQuestionRef.current ? (
                        <div className={styles.chatEmptyState}>
                            <SparkleFilled fontSize={"120px"} primaryFill={"rgba(115, 118, 225, 1)"} aria-hidden="true" aria-label="Chat logo" />
                            <h2 className={styles.chatEmptyStateSubtitle}>{t("chatwith.sub")}</h2>
                            <ul className={styles.examplesNavList}>
                                {EXAMPLES.map((x, i) => (
                                    <li key={i}>
                                        <div className={styles.example} onClick={() => runExample(x.prompt, x.query)}>
                                            <p className={styles.exampleText}>{x.summary}</p>
                                            <p className={styles.exampleTextSmall}>{t('prompt')} {x.prompt}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (

                    <div className={styles.chatMessageStream}>
                        {answers.map((answer, index) => (
                            <div key={index}>
                                <UserChatMessage message={answer[0]} />
                                <div className={styles.chatMessageGpt}>
                                    <ChatAnswer
                                        key={index}
                                        answer={answer[1]}
                                        isSelected={false}
                                        onFollowupQuestionClicked={q => makeApiRequest(q)}
                                    />
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <>
                                <UserChatMessage message={lastQuestionRef.current} />
                                <div className={styles.chatMessageGptMinWidth}>
                                    <AnswerLoading />
                                </div>
                            </>
                        )}
                        {error ? (
                            <>
                                <UserChatMessage message={lastQuestionRef.current} />
                                <div className={styles.chatMessageGptMinWidth}>
                                    <AnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
                                </div>
                            </>
                        ) : null}
                        <div ref={chatMessageStreamEnd} />
                    </div>
                    )}

                    <div className={styles.chatInput}>
                        <Stack tokens={stackTokens}>
                            <Stack.Item>
                                <TextField label={t("prompt")} required underlined placeholder={t("prompt.placeholder")} value={chatPrompt} onChange={onChatPromptChange}/>
                            </Stack.Item>
                            <Stack.Item>
                                <QuestionInput
                                    clearOnSend
                                    placeholder={t("placeholder")}
                                    disabled={isLoading || !chatPrompt.trim()}
                                    onSend={question => makeApiRequest(question)}
                                />
                            </Stack.Item>
                        </Stack>
                    </div>
                </div>

                <Panel
                    headerText={t("menu.title")}
                    isOpen={isConfigPanelOpen}
                    isBlocking={false}
                    onDismiss={() => setIsConfigPanelOpen(false)}
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={() => <DefaultButton onClick={() => setIsConfigPanelOpen(false)}>Close</DefaultButton>}
                    isFooterAtBottom={true}
                >
                    <Dropdown
                        placeholder={t("menu.model.select")}
                        label={t("menu.model")}
                        options={[
                                { key: Model.GPT_4, text: Model.GPT_4, selected: model == Model.GPT_4, data: Model.GPT_4 },
                            ]}
                        defaultValue={model}
                        onChange={onModelChange}
                    />
                    <SpinButton
                        className={styles.chatSettingsSeparator}
                        label={t('menu.desc2')}
                        min={0.0}
                        max={1.0}
                        step={0.1}
                        precision={1}
                        defaultValue={tempCount.toString()}
                        onChange={onTempCountChange}
                    />
                    <Slider label={t("menu.responsecount")} min={100} max={800} step={100} value={numCount} showValue onChange={onNumCountChange}/>
                    <Slider label={t("menu.maxhistory")} min={1} max={20} step={1} value={maxHistory} showValue onChange={onMaxHistoryChange}/>
                </Panel>
            </div>
        </div>
    );
};

export default Any;
