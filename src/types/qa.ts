export interface QA {
  id: number;

  question: string;
  q_timestamp: Date;

  answer: string;
  a_timestamp: Date | null;
  a_source: 'SYSTEM' | "OPENAI" | "N/A" | null;
}
