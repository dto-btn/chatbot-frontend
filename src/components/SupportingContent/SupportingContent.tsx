import { parseSupportingContentItem } from "./SupportingContentParser";

import styles from "./SupportingContent.module.css";

interface Props {
    supportingContent: string[];
}

export const SupportingContent = ({ supportingContent }: Props) => {
    return (
        <ul className={styles.supportingContentNavList}>
            <li className={styles.supportingContentItem}>
                <ul>
                {supportingContent.map((x, i) => {
                    const parsed = parseSupportingContentItem(x);
                    const Rexp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
                    const isLink = Rexp.test(parsed.title)

                    return isLink ? (
                        <li>
                          <a href={parsed.title} target="_blank">{parsed.title}</a>
                        </li>
                    ):
                    (<li>
                        {parsed.title}
                      </li>
                    );
                })}
                </ul>
            </li>
        </ul>
    );
};
