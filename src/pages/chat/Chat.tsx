import { useRef, useState, useEffect } from "react";
import { Checkbox, MessageBar, Panel, DefaultButton, SpinButton, IDropdownOption, Text, MessageBarType, Link, Stack, IStackTokens, IIconProps, Dialog, DialogFooter, PrimaryButton, DialogType, ContextualMenu, DialogContent, TextField, Dropdown, Slider, selectProperties } from "@fluentui/react";
import { Chat24Regular, Sleep20Filled, SparkleFilled } from "@fluentui/react-icons";
import styles from "./Chat.module.css";

import { chatApi, RetrievalMode, Approaches, AskResponse, ChatRequest, ChatTurn, FeedbackItem, ResponseMode, Model, ChatAllRequest, chatApiAll } from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
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
import { useNavigate } from 'react-router-dom';  

const Chat = () => {
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
    const [answers, setAnswers] = useState<[user: string, response: AskResponse][]>([]);

    const [responseMode, setResponseMode] = useState<ResponseMode>(ResponseMode.TreeSumarize);
    const [model, setModel] = useState<Model>(Model.GPT_4);
    const [numCount, setNumCount] = useState<number>(800);

    const { t, i18n } = useTranslation();

    const [answerStatus, setAnswerStatus] = useState<boolean[]>([]);

    const stackTokens: IStackTokens = {
        childrenGap: 10,
    };

    const infoIcon: IIconProps = { iconName: 'Info' };

    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const [feedbackItem, setFeedbackItem] = useState<FeedbackItem>({index: 0, type: FeedbackType.Like});

    let navigate = useNavigate();

    const makeApiRequest = async (question: string) => {

        lastQuestionRef.current = question;

        error && setError(undefined);
        setIsLoading(true);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);

        let res = null

        try {
            const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
            const request: ChatRequest = {
                question: question,
                chat_history: useHistory && answers.length > 0 ? answers[answers.length-1][1].chat_history : "",
                history: [...history, { user: question, bot: undefined }],
                approach: Approaches.ReadRetrieveRead,
                model: model,
                responseMode: responseMode,
                numCount: numCount,
                overrides: {
                    top: retrieveCount,
                    temperature: tempCount,
                }
            };
            const result = await chatApi(request, i18n.language);
            res = result.answer;
            setAnswers([...answers, [question, result]]);
            
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
            if(res) {
                checkQuestionAnswered(question, res);
            }
        }
    };

    const checkQuestionAnswered = async (question: string, answer: string) => {
        try{
            //Ask follow up question and for validation the question was answered properly.
            const request: ChatAllRequest = {
                query: `QUESTION: ${question} ANSWER: ${answer}`,
                history: [],
                prompt: t("answer.validate.query"),
                temp: 0.0,
            };

            const result = await chatApiAll(request);
            setAnswerStatus([...answerStatus, "yes".toLocaleLowerCase() === result.message.content.trim().toLocaleLowerCase()]);

        } catch (e) {
            console.error("Unable to get proper feedback for answer.",e);
        }
    };

    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        setAnswers([]);
        setAnswerStatus([]);
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

    const onExampleClicked = (example: string) => {
        makeApiRequest(example);
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

    const showFeedbackDialog = (type: FeedbackType, index: number) => {
        setFeedbackItem({index: index, type: type, answers: answers})
        toggleHideDialog()
    }

    const onResponseModeChange = (_ev: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<ResponseMode> | undefined, index?: number | undefined) => {
        setResponseMode(option?.data || ResponseMode.TreeSumarize);
    };

    const onModelChange = (_ev: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<Model> | undefined, index?: number | undefined) => {
        setModel(option?.data || Model.GPT_4);
    };

    const onNumCountChange = (value: number) => {
        setNumCount(value);
    };

    const responseModeOptions: IDropdownOption[] = [
        { key: 'tree_sumarize', text: 'tree_sumarize' },
        { key: 'refine', text: 'refine' },
        { key: 'compact', text: 'compact' },
        { key: 'simple_sumarize', text: 'simple_sumarize' },
        { key: 'accumulate', text: 'accumulate' },
        { key: 'compact_accumulate', text: 'compact_accumulate' },
      ];

    const [nextQuestion, setNextQuestion] = useState<string | null>(null);

    const retryQuestion = (question: string) => {
        clearChat();
        setNextQuestion(question);
    }

    useEffect(() => {
        if (nextQuestion !== null) {
            makeApiRequest(nextQuestion);
            setNextQuestion(null);
        }
    }, [nextQuestion]);

    const askGPT = (question: string) => {
        navigate('/any',{ 
            state: { question: question }
        });
    }

    return (

        <div className={styles.container}>
            <div className={styles.commandsContainer} role="navigation" aria-label="Options">
                <ClearChatButton className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading}/>
                <SettingsButton className={styles.commandButton} onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)}/>
            </div>
            <div className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                    {!lastQuestionRef.current ? (
                        <div className={styles.chatEmptyState} role="contentinfo" aria-label="Exemples">
                            <SparkleFilled fontSize={"120px"} primaryFill={"rgba(115, 118, 225, 1)"} aria-hidden="true" aria-label="Chat logo" />
                            <h1 className={styles.chatEmptyStateTitle}>{t("chatwith")}</h1>
                            <h2 className={styles.chatEmptyStateSubtitle}>{t("chatwith.sub")}</h2>
                            <ExampleList onExampleClicked={onExampleClicked} />
                        </div>
                    ) : (
                        <div className={styles.chatMessageStream} role="main">
                            {answers.map((answer, index) => (
                                <div key={index}>
                                    <UserChatMessage message={answer[0]} />
                                    <div className={styles.chatMessageGpt}>
                                        <Answer
                                            key={index}
                                            answer={answer[1]}
                                            question={answer[0]}
                                            isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
                                            onCitationClicked={c => onShowCitation(c, index)}
                                            onThoughtProcessClicked={() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                            onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                            onFollowupQuestionClicked={q => makeApiRequest(q)}
                                            showFollowupQuestions={answers.length - 1 === index}
                                            onFeedbackClicked={(type) => showFeedbackDialog(type, index)}
                                            questionAnswered={answerStatus[index] !== undefined ? answerStatus[index] : true}
                                            retryQuestion={retryQuestion}
                                            askGPT={askGPT}
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
                            <Stack.Item role="contentinfo" aria-label={t("feedback.link.label")}>
                                <MessageBar messageBarType={MessageBarType.success} isMultiline={false} messageBarIconProps={infoIcon}>
                                    <Link href={t("feedback.url")} target="_blank" underline>{t("feedback.long")}</Link>
                                </MessageBar>
                            </Stack.Item>
                            <Stack.Item role="form" aria-label={t("chatbot.input.label")}>
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

                {answers.length > 0 && activeAnalysisPanelTab && (
                    <AnalysisPanel
                        className={styles.chatAnalysisPanel}
                        activeCitation={activeCitation}
                        onActiveTabChanged={x => onToggleTab(x, selectedAnswer)}
                        citationHeight="810px"
                        answer={answers[selectedAnswer][1]}
                        activeTab={activeAnalysisPanelTab}
                    />
                )}

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
                        placeholder={t("menu.responsemode.select")}
                        label={t("menu.responsemode")}
                        options={[
                                { key: ResponseMode.TreeSumarize, text: ResponseMode.TreeSumarize, selected: responseMode == ResponseMode.TreeSumarize, data: ResponseMode.TreeSumarize},
                                { key: ResponseMode.SimpleSumarize, text: ResponseMode.SimpleSumarize, selected: responseMode == ResponseMode.SimpleSumarize, data: ResponseMode.SimpleSumarize},
                                { key: ResponseMode.Refine, text: ResponseMode.Refine, selected: responseMode == ResponseMode.Refine, data: ResponseMode.Refine},
                                { key: ResponseMode.Compact, text: ResponseMode.Compact, selected: responseMode == ResponseMode.Compact, data: ResponseMode.Compact},
                                { key: ResponseMode.Accumulate, text: ResponseMode.Accumulate, selected: responseMode == ResponseMode.Accumulate, data: ResponseMode.Accumulate},
                                { key: ResponseMode.CompactAccumulate, text: ResponseMode.CompactAccumulate, selected: responseMode == ResponseMode.CompactAccumulate, data: ResponseMode.CompactAccumulate},
                            ]}
                        defaultValue={responseMode}
                        onChange={onResponseModeChange}
                    />
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
                    <Slider label={t("menu.responsecount")} min={100} max={800} step={100} value={numCount} showValue onChange={onNumCountChange}/>
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

export default Chat;
