import { Text } from "@fluentui/react";
import { Delete24Regular } from "@fluentui/react-icons";

import styles from "./ClearChatButton.module.css";

import { useTranslation } from 'react-i18next';

interface Props {
    className?: string;
    onClick: () => void;
    disabled?: boolean;
}

export const ClearChatButton = ({ className, disabled, onClick }: Props) => {
    const { t } = useTranslation();

    // Function to handle keydown events  
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {  
        // Check if the key pressed is 'Enter' or 'Space'  
        if ((event.key === 'Enter' || event.key === ' ')) {  
            event.preventDefault(); // Prevent the default action (e.g., scrolling when space is pressed)  
            onClick(); // Call the onClick function  
        }  
    }; 

    return (
        <div tabIndex={0} className={`${styles.container} ${className ?? ""} ${disabled && styles.disabled}`} onClick={onClick} onKeyDown={handleKeyDown} role="button">
            <Delete24Regular />
            <Text>{t("clearchat.button")}</Text>
        </div>
    );
};
