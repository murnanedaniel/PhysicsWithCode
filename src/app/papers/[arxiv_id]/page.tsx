import { notFound } from "next/navigation"
import Link from "next/link"
import {
  getPaper, getResultsForPaper, tasks, datasets, getModel, getDomain
} from "@/lib/data"
import { papers } from "@/lib/data"
import { formatDate, formatMetricValue, arxivUrl } from "@/lib/utils"
import Badge from "@/components/Badge"
import { ExternalLink, Star, GitFork } from "lucide-react"

export function generateStaticParams() {
  return papers.map((p) => ({ arxiv_id: p.arxiv_id }))
}

export default function PaperPage({ params }: { params: { arxiv_id: string } }) {
  const paper = getPaper(params.arxiv_id)
  if (!paper) notFound()

  const paperResults = getResultsForPaper(paper.id)
  const paperTasks = tasks.filter((t) => paper.task_ids.includes(t.id))
  const paperDatasets = datasets.filter((d) => paper.dataset_ids.includes(d.id))

  const frameworkColors: Record<string, string> = {
    PyTorch: "orange",
    JAX: "purple",
    TensorFlow: "orange",
  }

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/papers" className="hover:text-brand-600">Papers</Link>
        <span className="mx-2">›</span>
        <span className="mono">{paper.arxiv_id}</span>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{paper.title}</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {paper.venue && <Badge variant="gray">{paper.venue}</Badge>}
        {paper.published_date && (
          <Badge variant="gray">{formatDate(paper.published_date)}</Badge>
        )}
        <a
          href={arxivUrl(paper.arxiv_id)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full hover:bg-red-100 no-underline"
        >
          <ExternalLink size={10} />
          arXiv:{paper.arxiv_id}
        </a>
      </div>

      <div className="text-sm text-gray-600 mb-6">
        {paper.authors.map((a, i) => (
          <span key={i}>
            {i > 0 && ", "}
            <span className="font-medium">{a.name}</span>
            {a.affiliation && <span className="text-gray-400"> ({a.affiliation})</span>}
          </span>
        ))}
      </div>

      {/* Abstract */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Abstract</h2>
        <p className="text-gray-800 leading-relaxed">{paper.abstract}</p>
      </div>

      {/* Code Links */}
      {paper.code_links.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Code</h2>
          <div className="flex flex-wrap gap-3">
            {paper.code_links.map((cl, i) => (
              <a
                key={i}
                href={cl.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 hover:border-brand-300 transition-colors no-underline"
              >
                <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                  {cl.url.replace("https://github.com/", "")}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {cl.framework && (
                    <Badge variant={(frameworkColors[cl.framework] as "orange" | "blue" | "gray") ?? "gray"}>
                      {cl.framework}
                    </Badge>
                  )}
                  {cl.is_official && <Badge variant="green">Official</Badge>}
                  {cl.stars > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-gray-500">
                      <Star size={11} />
                      {cl.stars.toLocaleString()}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Tasks */}
      {paperTasks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Tasks</h2>
          <div className="flex flex-wrap gap-2">
            {paperTasks.map((task) => {
              const domain = getDomain(task.domain_id)
              return (
                <Link
                  key={task.id}
                  href={`/tasks/${task.slug}`}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm hover:border-brand-300 no-underline text-gray-900 hover:text-brand-600 transition-colors"
                >
                  {task.name}
                  {domain && <span className="text-gray-400 ml-1">({domain.name})</span>}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Datasets */}
      {paperDatasets.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Datasets</h2>
          <div className="flex flex-wrap gap-2">
            {paperDatasets.map((ds) => (
              <Link
                key={ds.id}
                href={`/datasets/${ds.slug}`}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm hover:border-brand-300 no-underline text-gray-900 hover:text-brand-600 transition-colors"
              >
                {ds.name}
                {ds.format && <Badge variant="green">{ds.format}</Badge>}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {paperResults.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Benchmark Results</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Task</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Dataset</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Metrics</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {paperResults.map((r) => {
                  const task = tasks.find((t) => t.id === r.task_id)
                  const ds = datasets.find((d) => d.id === r.dataset_id)
                  return (
                    <tr key={r.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3">
                        {task && (
                          <Link href={`/tasks/${task.slug}`} className="hover:underline font-medium">
                            {task.name}
                          </Link>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{ds?.name}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {Object.entries(r.metric_values).map(([k, v]) => (
                          <span key={k} className="mr-3">
                            <span className="text-gray-400">{k}:</span>{" "}
                            <span className="font-semibold text-gray-900">{formatMetricValue(v)}</span>
                          </span>
                        ))}
                      </td>
                      <td className="px-4 py-3">
                        {r.is_sota && <Badge variant="gold">SOTA</Badge>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
