import Link from "next/link"
import { tasks, results, getDomain, domains } from "@/lib/data"

// Small colored icon for each task card (like paperswithcode)
const domainColors = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-green-100 text-green-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
]

function TaskIcon({ index }: { index: number }) {
  const color = domainColors[index % domainColors.length]
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </div>
  )
}

export default function TasksPage() {
  // Group tasks by top-level domain
  const domainGroups: Record<number, typeof tasks> = {}
  const ungrouped: typeof tasks = []

  for (const task of tasks) {
    if (task.domain_id !== null) {
      const domain = getDomain(task.domain_id)
      const topLevel = domain?.parent_id === null ? domain : getDomain(domain?.parent_id ?? null)
      const groupId = topLevel?.id ?? task.domain_id
      if (!domainGroups[groupId]) domainGroups[groupId] = []
      domainGroups[groupId].push(task)
    } else {
      ungrouped.push(task)
    }
  }

  const topLevelDomains = domains.filter((d) => d.parent_id === null)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Browse State-of-the-Art
        </h1>
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{topLevelDomains.filter(d => domainGroups[d.id]?.length).length}</span> physics domains
          {" · "}
          <span className="font-medium text-gray-700">{tasks.length}</span> benchmark tasks
        </p>
      </div>

      <div className="space-y-10">
        {topLevelDomains.map((domain) => {
          const groupTasks = domainGroups[domain.id] ?? []
          if (groupTasks.length === 0) return null
          return (
            <div key={domain.id}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{domain.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupTasks.map((task, idx) => {
                  const taskResults = results.filter((r) => r.task_id === task.id)
                  const primaryMetric = task.metrics[0]

                  return (
                    <Link
                      key={task.id}
                      href={`/tasks/${task.slug}`}
                      className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all block"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <TaskIcon index={idx} />
                        <div className="font-semibold text-gray-900 text-sm leading-snug pt-1">
                          {task.name}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                        {task.description}
                      </p>
                      <div className="text-xs text-gray-400">
                        {taskResults.length} result{taskResults.length !== 1 ? "s" : ""}
                        {primaryMetric && (
                          <span className="ml-2 text-gray-300">· {primaryMetric.name}</span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}

        {ungrouped.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Other</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ungrouped.map((task, idx) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.slug}`}
                  className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all block"
                >
                  <div className="flex items-start gap-3">
                    <TaskIcon index={idx} />
                    <div className="font-semibold text-gray-900 text-sm pt-1">{task.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
