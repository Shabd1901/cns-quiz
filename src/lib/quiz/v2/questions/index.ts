import { Question } from "../types"
import { m1Questions } from "./m1"
import { m2Questions } from "./m2"
import { m3Questions } from "./m3"
import { m4Questions } from "./m4"
import { m5Questions } from "./m5"
import { m6Questions } from "./m6"

export { m1Questions } from "./m1"
export { m2Questions } from "./m2"
export { m3Questions } from "./m3"
export { m4Questions } from "./m4"
export { m5Questions } from "./m5"
export { m6Questions } from "./m6"

export const allQuestions: Question[] = [
  ...m1Questions,
  ...m2Questions,
  ...m3Questions,
  ...m4Questions,
  ...m5Questions,
  ...m6Questions
]

export function getQuestionsByModule(moduleCode: string): Question[] {
  return allQuestions.filter(q => q.module.toLowerCase() === moduleCode.toLowerCase())
}

export function getQuestionsByTopic(topicId: string): Question[] {
  return allQuestions.filter(q => q.topicId.toLowerCase() === topicId.toLowerCase())
}
