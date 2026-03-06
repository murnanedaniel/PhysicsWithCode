import Link from "next/link"
import { tasks, results, getDomain, domains } from "@/lib/data"
import Badge from "@/components/Badge"

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tasks & Leaderboards</h1>
        <p className="text-gray-500 mt-1">{tasks.length} benchmark tasks across physics domains</p>
      </div>

      <div className="space-y-8">
        {topLevelDomains.map((domain) => {
          const groupTasks = domainGroups[domain.id] ?? []
          if (groupTasks.length === 0) return null
          return (
            <div key={domain.id}>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{domain.name}</h2>
              <p className="text-sm text-gray-500 mb-3">{domain.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {groupTasks.map((task) => {
                  const taskResults = results.filter((r) => r.task_id === task.id)
                  const sotaResult = taskResults.find((r) => r.is_sota)
                  const primaryMetric = task.metrics[0]
                  const sotaValue = sotaResult && primaryMetric
                    ? sotaResult.metric_values[primaryMetric.name]
                    : null

                  return (
                    <Link
                      key={task.id}
                      href={`/tasks/${task.slug}`}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-brand-300 transition-colors no-underline block"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 group-hover:text-brand-600 mb-1">
                            {task.name}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
                        </div>
                        {sotaValue !== null && primaryMetric && (
                          <div className="shrink-0 text-right">
                            <div className="text-xs text-gray-400">SOTA {primaryMetric.name}</div>
                            <div className="font-mono text-sm font-bold text-brand-700">
                              {Number.isInteger(sotaValue) ? sotaValue : sotaValue.toFixed(4)}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                        <span>{taskResults.length} results</span>
                        <span>·</span>
                        <span>{task.metrics.map((m) => m.name).join(", ")}</span>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Other</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ungrouped.map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.slug}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-brand-300 transition-colors no-underline block"
                >
                  <div className="font-semibold text-gray-900">{task.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
