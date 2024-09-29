import { QA } from "./qa";
import { TopicDetails } from "./topic";
import { UserCredentials } from "./user";

export interface Chat {
  id: number;
  user_id: number;
  topic_id: number;
}

export interface ChatDetails extends Chat {
  user?: UserCredentials;
  topic: TopicDetails;
}

export interface ChatDetailsWithQAs extends ChatDetails {
  qas: QA[];
}
