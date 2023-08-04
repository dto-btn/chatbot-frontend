import styles from "./SupportingContent.module.css";
import { ResponseMetadata } from "../../api/models";

interface Props {
    supportingContent: ResponseMetadata;
}

export const SupportingContent = ({ supportingContent }: Props) => {
    return (
        <ul className={styles.supportingContentNavList}>
            {Object.keys(supportingContent).map((key) => (
                <li className={styles.supportingContentItem}>
                    {
                    supportingContent[key].url != "" ? 
                        (<h4 className={styles.supportingContentItemHeader}><a href={supportingContent[key].url} target="_blank">{supportingContent[key].url}</a></h4>) : 
                        (<h4 className={styles.supportingContentItemHeader}>{supportingContent[key].filename}</h4>)
                    }
                    <p className={styles.supportingContentItemText}>{supportingContent[key].text}</p>
                </li>
            ))}       
        </ul>
    );
};
