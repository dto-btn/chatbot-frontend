import { TabList, Tab } from "@fluentui/react-components";
import DOMPurify from "dompurify";

import styles from "./AnalysisPanel.module.css";

import { SupportingContent } from "../SupportingContent";
import { AskResponse } from "../../api";
import { AnalysisPanelTabs } from "./AnalysisPanelTabs";
import { t } from "i18next";

interface Props {
    className: string;
    activeTab: AnalysisPanelTabs;
    onActiveTabChanged: (tab: AnalysisPanelTabs) => void;
    activeCitation: string | undefined;
    citationHeight: string;
    answer: AskResponse;
}

const pivotItemDisabledStyle = { disabled: true, style: { color: "grey" } };

export const AnalysisPanel = ({ answer, activeTab, activeCitation, citationHeight, className, onActiveTabChanged }: Props) => {
    const isDisabledThoughtProcessTab: boolean = true;
    const isDisabledSupportingContentTab: boolean = true;
    const isDisabledCitationTab: boolean = !activeCitation;

    return (
        <TabList
            className={className}
            selectedValue={activeTab}
            onTabSelect={(event, data) => data && onActiveTabChanged(data.value! as AnalysisPanelTabs)}
        >
            <Tab
                value={AnalysisPanelTabs.SupportingContentTab}
                
            >
                {t("supporting")}
                <SupportingContent  supportingContent={answer.metadata} />
            </Tab>
            <Tab
                value={AnalysisPanelTabs.CitationTab}

            >
                Citation
                <iframe title="Citation" src={activeCitation} width="100%" height={citationHeight} />
            </Tab>
        </TabList>
    );
};
