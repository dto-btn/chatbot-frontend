import React, { useEffect, useState } from 'react';
import { ChatAllRequest, chatApiAll } from '../../api';
import { IIconProps, Icon } from '@fluentui/react/lib/Icon';
import { Link, MessageBar, MessageBarButton, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { resolveTypeReferenceDirective } from 'typescript';

interface Props {
  question: string;
  retryQuestion: (question: string) => void;
}

const infoIcon: IIconProps = { iconName: 'Info2' };

const QuestionNotAnswered: React.FC<Props> = ({question, retryQuestion}) => {

  const { t, i18n } = useTranslation();

  return (
    <div>
        <MessageBar messageBarType={MessageBarType.info} 
                    isMultiline={true} 
                    messageBarIconProps={infoIcon}
                    actions={
                      <div>
                        <MessageBarButton onClick={() => retryQuestion(question)}>{t("retry")}</MessageBarButton>
                      </div>
                    }>
            {t("answer.not.found")}
        </MessageBar>
    </div>
  );
};

export default QuestionNotAnswered;
