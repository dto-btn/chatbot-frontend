import { Text } from "@fluentui/react";
import { Settings24Regular } from "@fluentui/react-icons";

import styles from "./SettingsButton.module.css";

import { useTranslation } from 'react-i18next';

interface Props {
    className?: string;
    onClick: () => void;
}

export const SettingsButton = ({ className, onClick }: Props) => {
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
        <div tabIndex={0} className={`${styles.container} ${className ?? ""}`} onClick={onClick} onKeyDown={handleKeyDown} role="button">
            <Settings24Regular />
            <Text>{t("menu.button")}</Text>
        </div>
    );
};
