import styles from "./SupportingContent.module.css";
import { ResponseMetadata } from "../../api/models";
import { parseAnswerToHtml } from "../Answer/AnswerParser";
import DOMPurify from "dompurify";

interface Props {
    supportingContent: ResponseMetadata;
}

const replaceDomain = (url: string | undefined, newDomain: string) => {
    if (!url) return ''; // handle undefined
    let urlObject = new URL(url);
    urlObject.hostname = newDomain;
    return urlObject.href;
}

export const SupportingContent = ({ supportingContent }: Props) => {
    return (
        <ul className={styles.supportingContentNavList}>
            {Object.keys(supportingContent).map((key) => (
                supportingContent[key].text.map((t, i) => (
                    <li className={styles.supportingContentItem}>
                        {supportingContent[key].title && supportingContent[key].url &&
                            (<h4 className={styles.supportingContentItemHeader}><a href={replaceDomain(supportingContent[key].url, 'plus.ssc-spc.gc.ca')} target="_blank">{supportingContent[key].title}</a></h4>)}
                        {!supportingContent[key].title && supportingContent[key].url &&
                            (<h4 className={styles.supportingContentItemHeader}><a href={replaceDomain(supportingContent[key].url, 'plus.ssc-spc.gc.ca')} target="_blank">{supportingContent[key].url}</a></h4>)}
                        {!supportingContent[key].title && !supportingContent[key].url &&
                            (<h4 className={styles.supportingContentItemHeader}>{supportingContent[key].filename}</h4>)}
                        {/* <h5>{supportingContent[key].node_scores[i]*100}</h5> */}
                        <p className={styles.supportingContentItemText}>{DOMPurify.sanitize(parseAnswerToHtml(t, function(){}).answerHtml)}</p>
                    </li>
                ))
            ))}
        </ul>
    );
};
