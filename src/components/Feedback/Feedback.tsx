import { MessageBarType, MessageBar, Dialog, TextField, DialogFooter, PrimaryButton, DefaultButton, DialogType, Stylesheet } from "@fluentui/react"
import { FeedbackType } from "./FeedbackType";
import { FeedbackItem, sendFeedback } from "../../api";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import React from "react";
import styles from "./Feedback.module.css";

interface Props {
    item: FeedbackItem;
    toggleHideDialog: () => void;
    hide: boolean    
}

export const Feedback = ({
    item,
    toggleHideDialog,
    hide
}: Props) => {

    const [feedbackMessage, setFeedbackMessage] = useState<string>("");

    const onFeedbackMessageChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setFeedbackMessage(newValue || "");
    };

    const { i18n, t } = useTranslation();

    const dialogContentProps = {
        type: DialogType.normal,
        title: item?.type == FeedbackType.Like ? t("tellus.like") : t("tellus.dislike")
    };

    const awnser = item.answers? item.answers[item.answers.length - 1][0]: "";

    const feedbackApiCall = async () => {
        item.text = feedbackMessage;
        const result = await sendFeedback(item, i18n.language);
        if(result.ok) {
            setFeedbackMessage("");
            setFeedbackSubmitted(true);
            //todo: show success message ...
        }
    };

    const [feedbackSubmitted, setFeedbackSubmitted] = React.useState<boolean>(false);

    const FeedbackSubmitted = () => (
        <MessageBar
          messageBarType={MessageBarType.success}
          isMultiline={false}
          className={styles.feedbackSubmitted}
        >
          {t("feedback.submitted")}.
        </MessageBar>
    );

    const clearSubmitted = () => {
        setFeedbackSubmitted(false);
        toggleHideDialog();
    };
    
    return (
        <Dialog
            hidden={hide}
            onDismiss={clearSubmitted}
            dialogContentProps={dialogContentProps}
        >
            <h4><b>{t("question.submitted")}</b></h4>
            <p>{awnser}</p>
            <h4><b>{t("msg.opt")}</b></h4>
            { feedbackSubmitted && <FeedbackSubmitted/>}
            <TextField multiline autoAdjustHeight width={600} value={feedbackMessage} onChange={onFeedbackMessageChange}/>
                { !feedbackSubmitted ? (
                    <DialogFooter>
                        <PrimaryButton onClick={feedbackApiCall} text={t("send")} />
                        <DefaultButton onClick={toggleHideDialog} text={t("dontsend")} />
                    </DialogFooter>
                ) : (
                    <DialogFooter>
                        <PrimaryButton onClick={feedbackApiCall} text={t("close")} />
                    </DialogFooter>
                )}
        </Dialog>
    )
}