import { useRef, useState, useEffect } from "react";
import { Checkbox, MessageBar, Panel, DefaultButton, SpinButton, IDropdownOption, Text, MessageBarType, Link, Stack, IStackTokens, IIconProps, Dialog, DialogFooter, PrimaryButton, DialogType, ContextualMenu, DialogContent, TextField, Dropdown, Slider } from "@fluentui/react";
import { Chat24Regular, SparkleFilled } from "@fluentui/react-icons";
import styles from "./Any.module.css";

import { chatApi, RetrievalMode, Approaches, AskResponse, ChatRequest, ChatTurn, FeedbackItem, ResponseMode, Model, ChatHistory, ChatAllRequest, chatApiAll, ChatResponse } from "../../api";
import { AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import { AnalysisPanel, AnalysisPanelTabs } from "../../components/AnalysisPanel";
import { SettingsButton } from "../../components/SettingsButton";
import { ClearChatButton } from "../../components/ClearChatButton";

import { useTranslation } from 'react-i18next';
import { useBoolean } from "@fluentui/react-hooks";
import { FeedbackType } from "../../components/Feedback/FeedbackType";
import React from "react";
import { Feedback } from "../../components/Feedback/Feedback";
import { ChatAnswer } from "../../components/Answer/ChatAnswer";

const Any = () => {
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [retrieveCount, setRetrieveCount] = useState<number>(3);
    const [tempCount, setTempCount] = useState<number>(0.7);

    const [useHistory, setUseHistory] = useState<boolean>(true);

    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<unknown>();

    const [activeCitation, setActiveCitation] = useState<string>();
    const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] = useState<AnalysisPanelTabs | undefined>(undefined);

    const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
    const [answers, setAnswers] = useState<[user: string, response: ChatResponse][]>([]);

    const [model, setModel] = useState<Model>(Model.GPT_4);
    const [numCount, setNumCount] = useState<number>(800);

    const { t, i18n } = useTranslation();

    const [chatPrompt, setChatPrompt] = useState<string>("")

    const stackTokens: IStackTokens = {
        childrenGap: 10,
    };

    const infoIcon: IIconProps = { iconName: 'Info' };

    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const [feedbackItem, setFeedbackItem] = useState<FeedbackItem>({index: 0, type: FeedbackType.Like});

    const makeApiRequest = async (question: string) => {

        lastQuestionRef.current = question;

        error && setError(undefined);
        setIsLoading(true);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);

        try {
            const request: ChatAllRequest = {
                query: question,
                history: useHistory && answers.length > 0 ? answers[answers.length-1][1].history : [],
                prompt: chatPrompt,
                tokens: numCount,
                temp: tempCount,
                past_msg_incl: 10
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
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        setAnswers([]);
    };

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);

    const onRetrieveCountChange = (_ev?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
        setRetrieveCount(parseInt(newValue || "3"));
    };

    const onTempCountChange = (_ev?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
        setTempCount(parseFloat(newValue || "0.7"));
    };

    const onUseHistory = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseHistory(!!checked);
    };

    const onShowCitation = (citation: string, index: number) => {
        if (activeCitation === citation && activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveCitation(citation);
            setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
        }

        setSelectedAnswer(index);
    };

    const onToggleTab = (tab: AnalysisPanelTabs, index: number) => {
        if (activeAnalysisPanelTab === tab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveAnalysisPanelTab(tab);
        }

        setSelectedAnswer(index);
    };

    const onModelChange = (_ev: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<Model> | undefined, index?: number | undefined) => {
        setModel(option?.data || Model.GPT_4);
    };

    const onNumCountChange = (value: number) => {
        setNumCount(value);
    };

    return (

        <div className={styles.container}>
            <div className={styles.commandsContainer}>
                <ClearChatButton className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading} />
                <div className={`${styles.commandButton} ${styles.containerBtn}`} onClick={() => window.open(t("msteams.channel.url"), "_blank")} title="Microsoft Teams">
                    <Chat24Regular />
                    <Text>{t("msteams.channel")}</Text>
                </div>
                <SettingsButton className={styles.commandButton} onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)} />
            </div>
            <div className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                    <div className={styles.chatMessageStream}>
                        {answers.map((answer, index) => (
                            <div key={index}>
                                <UserChatMessage message={answer[0]} />
                                <div className={styles.chatMessageGpt}>
                                    <ChatAnswer
                                        key={index}
                                        answer={answer[1]}
                                        isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
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
                    <div className={styles.chatInput}>
                        <Stack tokens={stackTokens}>
                            <Stack.Item>
                                <MessageBar messageBarType={MessageBarType.success} isMultiline={false} messageBarIconProps={infoIcon}>
                                    <Link href={t("feedback.url")} target="_blank" underline>{t("feedback.long")}</Link>
                                </MessageBar>
                            </Stack.Item>
                            <Stack.Item>
                                <TextField label="Prompt:" underlined placeholder="you are a pirate and you will answer as such!" value={chatPrompt}/>
                            </Stack.Item>
                            <Stack.Item>
                                <QuestionInput
                                    clearOnSend
                                    placeholder={t("placeholder")}
                                    disabled={isLoading}
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
                                { key: Model.GPT_4, text: Model.GPT_4, selected: model == Model.GPT_4, data: Model.GPT_4},
                            ]}
                        defaultValue={model}
                        onChange={onModelChange}
                    />
                    <SpinButton
                        className={styles.chatSettingsSeparator}
                        label={t('menu.desc')}
                        min={1}
                        max={5}
                        defaultValue={retrieveCount.toString()}
                        onChange={onRetrieveCountChange}
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
                    <Slider label={t("menu.responsecount")} min={100} max={800} step={100} defaultValue={800} showValue onChange={onNumCountChange}/>
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useHistory}
                        label={t("use.chathistory")}
                        onChange={onUseHistory}
                    />
                </Panel>

                <Feedback item={feedbackItem} hide={hideDialog} toggleHideDialog={toggleHideDialog}/>
            </div>
        </div>
    );
};

export default Any;
