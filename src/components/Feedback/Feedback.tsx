import { Dialog, TextField, DialogFooter, PrimaryButton, DefaultButton, DialogType } from "@fluentui/react"
import { FeedbackType } from "./FeedbackType";
import { FeedbackItem, sendFeedback } from "../../api";
import { useTranslation } from "react-i18next";
import { useState } from "react";

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

    const [feedbackMessage, setFeedbackMessage] = useState<string>();

    const onFeedbackMessageChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setFeedbackMessage(newValue || "");
    };

    const { i18n, t } = useTranslation();

    const dialogContentProps = {
        type: DialogType.normal,
        title: t("feedback"),
        subText: item?.type == FeedbackType.Like ? t("tellus.like") : t("tellus.dislike"),
    };

    const awnser = item.answers? item.answers[item.answers.length - 1][0]: "";

    const feedbackApiCall = async () => {
        item.text = feedbackMessage;
        const result = await sendFeedback(item, i18n.language);
        alert(result);
    }
    
    return (
        <Dialog
            hidden={hide}
            onDismiss={toggleHideDialog}
            dialogContentProps={dialogContentProps}
        >
            <h4><b>Submited question</b></h4>
            <p>{awnser}</p>
            <h4><b>{t("msg.opt")}</b></h4>
            <TextField multiline autoAdjustHeight width={600} value={feedbackMessage} onChange={onFeedbackMessageChange}/>
            <DialogFooter>
                <PrimaryButton onClick={() => {toggleHideDialog(); feedbackApiCall();}} text={t("send")} />
                <DefaultButton onClick={toggleHideDialog} text={t("dontsend")} />
            </DialogFooter>
        </Dialog>
    )
}