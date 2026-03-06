import { notFound } from "next/navigation"
import Link from "next/link"
import {
  getTask, getResultsForTask, getDomain, papers, datasets, models, tasks
} from "@/lib/data"
import { formatMetricValue, formatYear, arxivUrl } from "@/lib/utils"
import Badge from "@/components/Badge"
import { ExternalLink } from "lucide-react"

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

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/tasks" className="hover:text-brand-600">Tasks</Link>
        {domain && (
          <>
            <span className="mx-2">›</span>
            <span>{domain.name}</span>
          </>
        )}
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">{task.name}</span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{task.name}</h1>
        {domain && <Badge variant="blue">{domain.name}</Badge>}
      </div>

      <p className="text-gray-600 mb-6 leading-relaxed max-w-3xl">{task.description}</p>

      {/* Metrics legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {task.metrics.map((m) => (
          <div key={m.name} className="flex items-center gap-1.5 bg-gray-100 rounded px-2.5 py-1 text-sm">
            <span className="font-medium text-gray-700">{m.name}</span>
            <span className="text-gray-400 text-xs">
              ({m.higher_is_better ? "higher is better ↑" : "lower is better ↓"})
            </span>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            Leaderboard <span className="text-gray-400 font-normal text-sm">({sorted.length} results)</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-10">#</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Model</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Paper</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Code</th>
                {allMetricNames.map((m) => (
                  <th key={m} className="text-right px-4 py-3 font-semibold text-gray-600">
                    {m}
                  </th>
                ))}
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Year</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((result, idx) => {
                const paper = papers.find((p) => p.id === result.paper_id)
                const model = models.find((m) => m.id === result.model_id)
                const officialCode = paper?.code_links.find((c) => c.is_official) ?? paper?.code_links[0]

                return (
                  <tr
                    key={result.id}
                    className={`border-b border-gray-100 last:border-0 ${
                      result.is_sota ? "bg-amber-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-gray-400 text-xs">
                      {result.is_sota ? (
                        <span title="State of the Art">⭐</span>
                      ) : (
                        idx + 1
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {model ? (
                        <div>
                          <div className="font-semibold text-gray-900">{model.name}</div>
                          {model.full_name && model.full_name !== model.name && (
                            <div className="text-xs text-gray-400 truncate max-w-[180px]">{model.full_name}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {paper && (
                        <Link
                          href={`/papers/${paper.arxiv_id}`}
                          className="text-xs text-brand-600 hover:underline line-clamp-2 block"
                        >
                          {paper.title}
                        </Link>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {officialCode && (
                        <a
                          href={officialCode.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-brand-600"
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
                          className={`px-4 py-3 text-right font-mono ${
                            isPrimary ? "font-bold text-gray-900" : "text-gray-600"
                          }`}
                        >
                          {val !== undefined ? formatMetricValue(val) : "—"}
                        </td>
                      )
                    })}
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatYear(result.submitted_at)}
                    </td>
                    <td className="px-4 py-3">
                      {result.verified && (
                        <span title="Verified result" className="text-green-600 text-xs">✓</span>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Papers</h2>
            <div className="space-y-3">
              {taskPapers.map((paper) => (
                <div key={paper.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <Link href={`/papers/${paper.arxiv_id}`} className="font-medium text-gray-900 hover:text-brand-600 block mb-1">
                    {paper.title}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
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
