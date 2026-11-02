import { notFound } from "next/navigation"
import { getPresentation } from "@/lib/present/plates"
import { PresenterModeV2 } from "@/components/present/PresenterModeV2"
import { SYLLABUS } from "@/lib/syllabus"

export function generateStaticParams() {
  const params: Array<{ module: string; topic: string }> = []

  SYLLABUS.forEach(mod => {
    mod.topics.forEach(t => {
      params.push({ module: mod.code.toLowerCase(), topic: t.id })
      params.push({ module: mod.id.toLowerCase(), topic: t.id })
    })
  })

  return params
}

export const instant = false

export default async function PresentTopicPage({
  params
}: {
  params: Promise<{ module: string; topic: string }>
}) {
  const { module: modId, topic: topicId } = await params
  const presentation = getPresentation(modId, topicId)

  if (!presentation) {
    notFound()
  }

  return <PresenterModeV2 presentation={presentation} />
}
