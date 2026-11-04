import { notFound } from "next/navigation"
import { QuizModeId } from "@/lib/quiz/v2/types"
import { allQuestions, getQuestionsByModule } from "@/lib/quiz/v2/questions"
import { QuizPlayer } from "@/components/quiz/v2/QuizPlayer"
import WPQuiz from "@/modules/wp/WPQuiz"

export function generateStaticParams() {
  return [
    { mode: 'm1' },
    { mode: 'm2' },
    { mode: 'm3' },
    { mode: 'm4' },
    { mode: 'm5' },
    { mode: 'm6' },
    { mode: 'all' },
    { mode: 'wp-m1' },
    { mode: 'wp-m2' },
    { mode: 'wp-m3' },
    { mode: 'wp-m4' },
    { mode: 'wp-m5' },
    { mode: 'wp-m6' },
    { mode: 'wp-all' },
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
  const normalized = modeParam.toLowerCase()

  const validModes = [
    'm1',
    'm2',
    'm3',
    'm4',
    'm5',
    'm6',
    'all',
    'wp-m1',
    'wp-m2',
    'wp-m3',
    'wp-m4',
    'wp-m5',
    'wp-m6',
    'wp-all',
    'exam-challenge',
    'classroom',
    'numerical-lab',
    'diagram-quiz',
    'self-test'
  ]

  if (!validModes.includes(normalized)) {
    notFound()
  }

  // If Web Programming module or full syllabus quiz
  if (normalized.startsWith('wp-')) {
    return (
      <div className="min-h-screen bg-paper py-8 px-4">
        <WPQuiz moduleId={normalized as any} />
      </div>
    )
  }

  // Filter questions based on selected module for CNS
  let filteredQuestions = [...allQuestions]
  let initialModule = 'ALL'

  if (['m1', 'm2', 'm3', 'm4', 'm5', 'm6'].includes(normalized)) {
    filteredQuestions = getQuestionsByModule(normalized)
    initialModule = normalized.toUpperCase()
  } else if (normalized === 'numerical-lab') {
    filteredQuestions = allQuestions.filter(q => q.type === 'numeric')
  } else if (normalized === 'diagram-quiz') {
    filteredQuestions = allQuestions.filter(q => q.type === 'label' || q.type === 'order' || q.type === 'spot')
  }

  return (
    <QuizPlayer
      mode={normalized as QuizModeId}
      questions={filteredQuestions}
      initialModule={initialModule}
    />
  )
}
