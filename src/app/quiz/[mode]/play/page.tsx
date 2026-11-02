import { notFound } from "next/navigation"
import { QuizModeId } from "@/lib/quiz/v2/types"
import { allQuestions } from "@/lib/quiz/v2/questions"
import { QuizPlayer } from "@/components/quiz/v2/QuizPlayer"

export function generateStaticParams() {
  return [
    { mode: 'exam-challenge' },
    { mode: 'classroom' },
    { mode: 'numerical-lab' },
    { mode: 'diagram-quiz' },
    { mode: 'self-test' }
  ]
}

export const instant = false

export default async function QuizPlayPage({
  params
}: {
  params: Promise<{ mode: string }>
}) {
  const { mode: modeParam } = await params
  const validModes: QuizModeId[] = [
    'exam-challenge',
    'classroom',
    'numerical-lab',
    'diagram-quiz',
    'self-test'
  ]

  const mode = modeParam as QuizModeId
  if (!validModes.includes(mode)) {
    notFound()
  }

  // Filter or prioritize questions based on mode
  let filteredQuestions = [...allQuestions]
  if (mode === 'numerical-lab') {
    filteredQuestions = allQuestions.filter(q => q.type === 'numeric')
    if (filteredQuestions.length === 0) filteredQuestions = allQuestions.filter(q => q.tags.includes('math'))
    if (filteredQuestions.length === 0) filteredQuestions = allQuestions
  } else if (mode === 'diagram-quiz') {
    filteredQuestions = allQuestions.filter(q => q.type === 'label' || q.type === 'order' || q.type === 'spot')
    if (filteredQuestions.length === 0) filteredQuestions = allQuestions
  }

  return <QuizPlayer mode={mode} questions={filteredQuestions} />
}
