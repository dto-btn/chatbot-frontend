import styles from "./Example.module.css";

interface Props {
    text: string;
    value: string;
    onClick: (value: string) => void;
}

export const Example = ({ text, value, onClick }: Props) => {

    // Function to handle keydown events  
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {  
        // Check if the key pressed is 'Enter' or 'Space'  
        if ((event.key === 'Enter' || event.key === ' ')) {  
            event.preventDefault(); // Prevent the default action (e.g., scrolling when space is pressed)  
            onClick(value); // Call the onClick function  
        }  
    };
    return (
        <div className={styles.example} onClick={() => onClick(value)} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
            <p className={styles.exampleText}>{text}</p>
        </div>
    );
};
