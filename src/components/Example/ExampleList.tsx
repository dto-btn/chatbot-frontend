import { Example } from "./Example";

import styles from "./Example.module.css";
import { useTranslation } from 'react-i18next';

export type ExampleModel = {
    text: string;
    value: string;
};

interface Props {
    onExampleClicked: (value: string) => void;
}

export const ExampleList = ({ onExampleClicked }: Props) => {
    const { t } = useTranslation();

    const EXAMPLES: ExampleModel[] = [
        { text: t('example1'), value: t('example1') },
        { text: t('example2'), value: t('example2') },
        { text: t('example3'), value: t('example3') }
    ];
    
    return (
        <ul className={styles.examplesNavList}>
            {EXAMPLES.map((x, i) => (
                <li key={i}>
                    <Example text={x.text} value={x.value} onClick={onExampleClicked} />
                </li>
            ))}
        </ul>
    );
};
