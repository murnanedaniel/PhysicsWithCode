import Link from "next/link"
import { getStats, papers, tasks, datasets, results, getDomain, getModel } from "@/lib/data"
import { formatDate, formatYear, arxivUrl, truncate } from "@/lib/utils"
import Badge from "@/components/Badge"

export default function Home() {
  const stats = getStats()

  // Trending: papers sorted by number of code link stars
  const trendingPapers = [...papers]
    .sort((a, b) => {
      const starsA = a.code_links.reduce((s, l) => s + l.stars, 0)
      const starsB = b.code_links.reduce((s, l) => s + l.stars, 0)
      return starsB - starsA
    })
    .slice(0, 6)

  // Recent SOTA results
  const sotaResults = results
    .filter((r) => r.is_sota)
    .slice(0, 5)
    .map((r) => {
      const task = tasks.find((t) => t.id === r.task_id)
      const paper = papers.find((p) => p.id === r.paper_id)
      const model = getModel(r.model_id)
      const primaryMetric = task?.metrics[0]
      const value = primaryMetric ? r.metric_values[primaryMetric.name] : null
      return { r, task, paper, model, primaryMetric, value }
    })
    .filter((x) => x.task && x.paper)

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-12 mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Physics Machine Learning Benchmarks
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track state-of-the-art results, papers, and datasets for machine learning
          in physics — from jet tagging to neural operators to molecular dynamics.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-12">
        {[
          { label: "Papers", value: stats.papers },
          { label: "Tasks", value: stats.tasks },
          { label: "Datasets", value: stats.datasets },
          { label: "Models", value: stats.models },
          { label: "Results", value: stats.results },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-brand-600">{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trending Papers */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Trending Papers</h2>
            <Link href="/papers" className="text-sm text-brand-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {trendingPapers.map((paper) => {
              const domain = getDomain(paper.task_ids[0] ? (tasks.find(t => t.id === paper.task_ids[0])?.domain_id ?? null) : null)
              const totalStars = paper.code_links.reduce((s, l) => s + l.stars, 0)
              return (
                <div key={paper.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-brand-300 transition-colors">
                  <div className="flex gap-2 mb-1 flex-wrap">
                    {domain && <Badge variant="blue">{domain.name}</Badge>}
                    {paper.venue && <Badge variant="gray">{paper.venue}</Badge>}
                  </div>
                  <Link
                    href={`/papers/${paper.arxiv_id}`}
                    className="font-medium text-gray-900 hover:text-brand-600 line-clamp-2 block mb-1"
                  >
                    {paper.title}
                  </Link>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{paper.authors.slice(0, 2).map((a) => a.name).join(", ")}{paper.authors.length > 2 ? " et al." : ""}</span>
                    <span>·</span>
                    <span>{formatYear(paper.published_date)}</span>
                    {totalStars > 0 && (
                      <>
                        <span>·</span>
                        <span>★ {totalStars.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* SOTA Results + Featured Tasks */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Latest SOTA</h2>
              <Link href="/tasks" className="text-sm text-brand-600 hover:underline">
                Leaderboards →
              </Link>
            </div>
            <div className="space-y-2">
              {sotaResults.map(({ r, task, paper, model, primaryMetric, value }) => (
                <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/tasks/${task!.slug}`}
                        className="text-sm font-medium text-gray-900 hover:text-brand-600 block truncate"
                      >
                        {task!.name}
                      </Link>
                      <div className="text-xs text-gray-500 mt-0.5 truncate">
                        {model?.name ?? paper!.title.split(" ").slice(0, 4).join(" ")}
                      </div>
                    </div>
                    {primaryMetric && value !== null && (
                      <div className="text-right shrink-0">
                        <div className="text-xs text-gray-400">{primaryMetric.name}</div>
                        <div className="text-sm font-mono font-semibold text-brand-700">
                          {typeof value === "number" && Number.isInteger(value) ? value : value.toFixed(4)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Datasets</h2>
              <Link href="/datasets" className="text-sm text-brand-600 hover:underline">
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {datasets.slice(0, 4).map((ds) => (
                <Link
                  key={ds.id}
                  href={`/datasets/${ds.slug}`}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-brand-300 transition-colors group"
                >
                  <span className="text-sm font-medium text-gray-900 group-hover:text-brand-600 truncate">
                    {ds.name}
                  </span>
                  {ds.format && <Badge variant="green">{ds.format}</Badge>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
