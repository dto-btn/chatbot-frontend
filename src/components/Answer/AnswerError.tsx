import { Button } from "@fluentui/react-components";
import { ErrorCircle24Regular } from "@fluentui/react-icons";

import styles from "./Answer.module.css";
import { t } from "i18next";

interface Props {
    error: string;
    onRetry: () => void;
}

export const AnswerError = ({ error, onRetry }: Props) => {
    return (
        <div className={styles.answerContainer}>
            <ErrorCircle24Regular aria-hidden="true" aria-label="Error icon" primaryFill="red" />
            <p className={styles.answerText}>{error}</p>
            <Button appearance="primary" className={styles.retryButton} onClick={onRetry}>{t("retry")}</Button>
        </div>
    );
};
