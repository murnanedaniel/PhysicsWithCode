import Link from "next/link"
import { getStats, papers, tasks, datasets, results, getDomain, getModel } from "@/lib/data"
import { formatYear } from "@/lib/utils"
import Badge from "@/components/Badge"

export default function Home() {
  const stats = getStats()

  // Trending: papers sorted by total code stars
  const trendingPapers = [...papers]
    .sort((a, b) => {
      const starsA = a.code_links.reduce((s, l) => s + l.stars, 0)
      const starsB = b.code_links.reduce((s, l) => s + l.stars, 0)
      return starsB - starsA
    })
    .slice(0, 6)

  // SOTA results
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
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Browse Physics ML Benchmarks
        </h1>
        <p className="text-gray-500 text-sm mb-1">
          <span className="font-medium text-gray-700">{stats.tasks}</span> benchmark tasks
          {" · "}
          <span className="font-medium text-gray-700">{stats.papers}</span> papers
          {" · "}
          <span className="font-medium text-gray-700">{stats.datasets}</span> datasets
          {" · "}
          <span className="font-medium text-gray-700">{stats.models}</span> models
        </p>
        <p className="text-gray-500 text-sm">
          Track state-of-the-art results for machine learning in physics — jet tagging,
          neural operators, molecular dynamics, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Trending Papers — 2/3 width */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Trending Papers</h2>
            <Link href="/papers" className="text-sm text-brand-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {trendingPapers.map((paper) => {
              const domainId = paper.task_ids[0]
                ? (tasks.find((t) => t.id === paper.task_ids[0])?.domain_id ?? null)
                : null
              const domain = getDomain(domainId)
              const totalStars = paper.code_links.reduce((s, l) => s + l.stars, 0)
              return (
                <div
                  key={paper.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex gap-2 mb-1.5 flex-wrap">
                    {domain && <Badge variant="blue">{domain.name}</Badge>}
                    {paper.venue && <Badge variant="gray">{paper.venue}</Badge>}
                  </div>
                  <Link
                    href={`/papers/${paper.arxiv_id}`}
                    className="font-semibold text-gray-900 hover:text-brand-600 line-clamp-2 block mb-1 text-sm leading-snug"
                  >
                    {paper.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                    <span>
                      {paper.authors.slice(0, 2).map((a) => a.name).join(", ")}
                      {paper.authors.length > 2 ? " et al." : ""}
                    </span>
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

        {/* Sidebar — SOTA + Datasets */}
        <div className="space-y-8">
          {/* Latest SOTA */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Latest SOTA</h2>
              <Link href="/tasks" className="text-sm text-brand-600 hover:underline">
                Leaderboards →
              </Link>
            </div>
            <div className="space-y-1.5">
              {sotaResults.map(({ r, task, paper, model, primaryMetric, value }) => (
                <Link
                  key={r.id}
                  href={`/tasks/${task!.slug}`}
                  className="flex items-start justify-between border border-gray-200 rounded-lg p-3 hover:border-gray-300 hover:shadow-sm transition-all block"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {task!.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">
                      {model?.name ?? paper!.title.split(" ").slice(0, 4).join(" ")}
                    </div>
                  </div>
                  {primaryMetric && value !== null && (
                    <div className="text-right shrink-0">
                      <div className="text-xs text-gray-400">{primaryMetric.name}</div>
                      <div className="text-sm font-mono font-bold text-brand-600">
                        {typeof value === "number" && Number.isInteger(value)
                          ? value
                          : (value as number).toFixed(4)}
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Datasets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Datasets</h2>
              <Link href="/datasets" className="text-sm text-brand-600 hover:underline">
                View all →
              </Link>
            </div>
            <div className="space-y-1.5">
              {datasets.slice(0, 4).map((ds) => (
                <Link
                  key={ds.id}
                  href={`/datasets/${ds.slug}`}
                  className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <span className="text-sm font-medium text-gray-800 group-hover:text-brand-600 truncate">
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
