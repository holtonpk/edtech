// export type testResponse = {
//   info: {
//     title: string;
//     version: string;
//   };
//   multiChoiceQuestions?: {
//     question: string;
//     choices: string[];
//     answer: string;
//   }[];
//   openEndedQuestions?: {
//     question: string;
//     answer: string;
//   }[];
// };

export type presentationResponse = {
  title: string;
  slides: {
    title: string;
    content: string;
  }[];
};
