import { Example } from "./Example";

import styles from "./Example.module.css";

export type ExampleModel = {
    text: string;
    value: string;
};

const EXAMPLES: ExampleModel[] = [
    {
        text: "Who is the president of SSC?",
        value: "Who is the president of SSC?"
    },
    { text: "What is the URL for the Archibus application?", value: "What is the URL for the Archibus application?" },
    { text: "What are the steps to hire a new employee at SSC?", value: "What are the steps to hire a new employee at SSC?" }
];

interface Props {
    onExampleClicked: (value: string) => void;
}

export const ExampleList = ({ onExampleClicked }: Props) => {
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
