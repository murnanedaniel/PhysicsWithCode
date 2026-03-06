import { notFound } from "next/navigation"
import Link from "next/link"
import {
  getTask, getResultsForTask, getDomain, papers, models, tasks
} from "@/lib/data"
import { formatMetricValue, formatYear, arxivUrl } from "@/lib/utils"
import { ExternalLink } from "lucide-react"
import PerformanceChart from "@/components/PerformanceChart"

export function generateStaticParams() {
  return tasks.map((t) => ({ slug: t.slug }))
}

export default function TaskPage({ params }: { params: { slug: string } }) {
  const task = getTask(params.slug)
  if (!task) notFound()

  const domain = getDomain(task.domain_id)
  const taskResults = getResultsForTask(task.id)

  // Sort by first metric
  const primaryMetric = task.metrics[0]
  const sorted = [...taskResults].sort((a, b) => {
    const va = a.metric_values[primaryMetric?.name ?? ""] ?? 0
    const vb = b.metric_values[primaryMetric?.name ?? ""] ?? 0
    return primaryMetric?.higher_is_better ? vb - va : va - vb
  })

  const allMetricNames = task.metrics.map((m) => m.name)

  // Build chart data: pass model names along with results
  const chartResults = taskResults.map((r) => {
    const model = models.find((m) => m.id === r.model_id)
    return {
      submitted_at: r.submitted_at,
      metric_values: r.metric_values,
      model_name: model?.name,
    }
  })

  const showChart = primaryMetric && taskResults.length >= 2

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-5 flex items-center gap-1.5">
        <Link href="/tasks" className="hover:text-gray-600">Tasks</Link>
        {domain && (
          <>
            <span>›</span>
            <span className="text-gray-500">{domain.name}</span>
          </>
        )}
        <span>›</span>
        <span className="text-gray-700 font-medium">{task.name}</span>
      </div>

      {/* Title row */}
      <div className="mb-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{task.name}</h1>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-600 text-white">
          State-of-the-Art Leaderboard
        </span>
        {domain && (
          <span className="text-sm text-gray-400">{domain.name}</span>
        )}
      </div>

      <p className="text-gray-600 mb-6 leading-relaxed max-w-3xl text-sm">{task.description}</p>

      {/* Metrics info */}
      <div className="flex flex-wrap gap-2 mb-8">
        {task.metrics.map((m) => (
          <div key={m.name} className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1 text-xs">
            <span className="font-medium text-gray-700">{m.name}</span>
            <span className="text-gray-400">
              {m.higher_is_better ? "↑ higher is better" : "↓ lower is better"}
            </span>
          </div>
        ))}
      </div>

      {/* Chart + Leaderboard card */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-base">
            Leaderboard
            <span className="text-gray-400 font-normal text-sm ml-2">
              ({sorted.length} result{sorted.length !== 1 ? "s" : ""})
            </span>
          </h2>
        </div>

        {/* Performance over time chart */}
        {showChart && (
          <div className="px-5 pt-5 pb-2 border-b border-gray-100">
            <PerformanceChart results={chartResults} metric={primaryMetric} />
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Model</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Paper</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</th>
                {allMetricNames.map((m) => (
                  <th key={m} className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {m}
                  </th>
                ))}
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Year</th>
                <th className="px-5 py-3 w-6" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((result, idx) => {
                const paper = papers.find((p) => p.id === result.paper_id)
                const model = models.find((m) => m.id === result.model_id)
                const officialCode = paper?.code_links.find((c) => c.is_official) ?? paper?.code_links[0]
                const isFirst = idx === 0

                return (
                  <tr
                    key={result.id}
                    className={`border-b border-gray-100 last:border-0 transition-colors ${
                      isFirst
                        ? "bg-blue-50/40"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-5 py-3">
                      {isFirst ? (
                        <span className="text-yellow-500 text-base" title="State of the Art">🏆</span>
                      ) : (
                        <span className="text-xs text-gray-400 font-mono">{idx + 1}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {model ? (
                        <div>
                          <div className={`font-semibold ${isFirst ? "text-gray-900" : "text-gray-800"}`}>
                            {model.name}
                          </div>
                          {model.full_name && model.full_name !== model.name && (
                            <div className="text-xs text-gray-400 truncate max-w-[180px]">{model.full_name}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 max-w-[200px]">
                      {paper && (
                        <Link
                          href={`/papers/${paper.arxiv_id}`}
                          className="text-xs text-brand-600 hover:underline line-clamp-2 block"
                        >
                          {paper.title}
                        </Link>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {officialCode && (
                        <a
                          href={officialCode.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-brand-600 transition-colors"
                        >
                          <ExternalLink size={11} />
                          {officialCode.framework ?? "Code"}
                        </a>
                      )}
                    </td>
                    {allMetricNames.map((metricName) => {
                      const val = result.metric_values[metricName]
                      const isPrimary = metricName === allMetricNames[0]
                      return (
                        <td
                          key={metricName}
                          className={`px-5 py-3 text-right font-mono text-xs ${
                            isPrimary
                              ? "font-bold text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          {val !== undefined ? formatMetricValue(val) : "—"}
                        </td>
                      )
                    })}
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {formatYear(result.submitted_at)}
                    </td>
                    <td className="px-5 py-3">
                      {result.verified && (
                        <span title="Verified result" className="text-green-500 text-xs font-medium">✓</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Papers section */}
      {(() => {
        const taskPapers = papers.filter((p) => p.task_ids.includes(task.id))
        if (taskPapers.length === 0) return null
        return (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Papers</h2>
            <div className="space-y-2">
              {taskPapers.map((paper) => (
                <div key={paper.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <Link href={`/papers/${paper.arxiv_id}`} className="font-medium text-gray-900 hover:text-brand-600 block mb-1 text-sm">
                    {paper.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                    <span>{paper.authors.slice(0, 3).map((a) => a.name).join(", ")}{paper.authors.length > 3 ? " et al." : ""}</span>
                    <span>·</span>
                    <span className="mono">{paper.arxiv_id}</span>
                    <a href={arxivUrl(paper.arxiv_id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 hover:text-brand-600">
                      <ExternalLink size={10} /> arXiv
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
