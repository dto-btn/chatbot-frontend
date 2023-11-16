import React, { useEffect, useState } from 'react';
import { ChatAllRequest, chatApiAll } from '../../api';

interface Props {
  question: string;
  answer: string;
}

const QuestionAnswered: React.FC<Props> = ({ question, answer }) => {
  const [isAnswered, setIsAnswered] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchAnswered = async () => {
        try{
            //Ask follow up question and for validation the question was answered properly.
            const request: ChatAllRequest = {
                query: `QUESTION: ${question} ANSWER: ${answer}`,
                history: [],
                prompt: "I will give you a question that was asked by the user and the awnser you gave back. Were you able to successfully help the user with that answer. Uniquely answer by YES or by NO",
                temp: 0.0,
            };
            const result = await chatApiAll(request);
            setIsAnswered("yes".toLocaleLowerCase() === result.message.content.toLocaleLowerCase() ? true : false);
        } catch (e) {
            console.error("Unable to get proper feedback for answer.",e);
        }
    };
    fetchAnswered();
  }, [question, answer]);

  return (
    <div>
      {isAnswered === null ? "Loading..." : isAnswered ? "The question was answered." : "The question was not answered."}
    </div>
  );
};

export default QuestionAnswered;
