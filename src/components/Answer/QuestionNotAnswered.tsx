import { MessageBar, MessageBarButton, MessageBarType } from '@fluentui/react';
import { IIconProps } from '@fluentui/react/lib/Icon';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  question: string;
  retryQuestion: (question: string) => void;
  askGPT: (question: string) => void;
}

const infoIcon: IIconProps = { iconName: 'Info2' };

const QuestionNotAnswered: React.FC<Props> = ({question, retryQuestion, askGPT}) => {

  const { t, i18n } = useTranslation();

  return (
    <div>
        <MessageBar messageBarType={MessageBarType.info} 
                    isMultiline={true} 
                    messageBarIconProps={infoIcon}
                    actions={
                      <div>
                        <MessageBarButton onClick={() => retryQuestion(question)}>{t("retry")}</MessageBarButton>
                        <MessageBarButton onClick={() => askGPT(question)}>{t("any.question")}</MessageBarButton>
                      </div>
                    }>
            {t("answer.not.found")}
        </MessageBar>
    </div>
  );
};

export default QuestionNotAnswered;
