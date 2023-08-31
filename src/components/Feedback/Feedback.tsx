import { Dialog, TextField, DialogFooter, PrimaryButton, DefaultButton, DialogType } from "@fluentui/react"
import { FeedbackType } from "./FeedbackType";
import { AskResponse, FeedbackItem } from "../../api";
import { useTranslation } from "react-i18next";
import { number, string } from "prop-types";

interface Props {
    item: FeedbackItem | undefined;
    toggleHideDialog: () => void;
    hide: boolean    
}

export const Feedback = ({
    item,
    toggleHideDialog,
    hide
}: Props) => {

    const { t } = useTranslation();

    const dialogContentProps = {
        type: DialogType.normal,
        title: t("feedback"),
        subText: "type",
    };
    
    return (
        <Dialog
            hidden={hide}
            onDismiss={toggleHideDialog}
            dialogContentProps={dialogContentProps}
        >
            <TextField multiline autoAdjustHeight width={600}/>
            <DialogFooter>
                <PrimaryButton onClick={toggleHideDialog} text="Send" />
                <DefaultButton onClick={toggleHideDialog} text="Don't send" />
            </DialogFooter>
        </Dialog>
    )
}