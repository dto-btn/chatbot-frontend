import { animated, useSpring } from "@react-spring/web";

import styles from "./Answer.module.css";
import { AnswerIcon } from "./AnswerIcon";

import { useTranslation } from "react-i18next";

export const AnswerLoading = () => {
    const animatedStyles = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 }
    });

    const { t } = useTranslation();

    return (
        <animated.div style={{ ...animatedStyles }}>
            <div className={styles.answerContainer} >
                <AnswerIcon />
                    <p className={styles.answerText}>
                        {t('generating')}
                        <span className={styles.loadingdots} />
                    </p>
            </div>
        </animated.div>
    );
};
