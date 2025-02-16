export interface GameState {
  question_index: number;
  questionDisplay: QuestionDisplay;
  userStatuses: UserState[];
  owner: string;
}

export interface QuestionDisplay {
  text: string;
  options: string[];
}

export interface UserState {
  userId: string;
  name: string;
  lifePoints: number;
  answer?: Answer;
}

export interface Answer {
  choice: number;
  timestamp: Date;
}
