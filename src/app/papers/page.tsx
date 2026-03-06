import Link from "next/link"
import { papers, getDomain, tasks } from "@/lib/data"
import { formatYear, arxivUrl, truncate } from "@/lib/utils"
import Badge from "@/components/Badge"
import { ExternalLink } from "lucide-react"

export default function PapersPage() {
  const sorted = [...papers].sort((a, b) => {
    const da = a.published_date ?? ""
    const db = b.published_date ?? ""
    return db.localeCompare(da)
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Papers</h1>
        <p className="text-gray-500 mt-1">{papers.length} papers indexed</p>
      </div>

      <div className="space-y-4">
        {sorted.map((paper) => {
          const domain = getDomain(
            paper.task_ids[0]
              ? (tasks.find((t) => t.id === paper.task_ids[0])?.domain_id ?? null)
              : null
          )
          const totalStars = paper.code_links.reduce((s, l) => s + l.stars, 0)
          const officialRepo = paper.code_links.find((c) => c.is_official) ?? paper.code_links[0]

          return (
            <div
              key={paper.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-brand-300 transition-colors"
            >
              <div className="flex gap-2 mb-2 flex-wrap">
                {domain && <Badge variant="blue">{domain.name}</Badge>}
                {paper.venue && <Badge variant="gray">{paper.venue}</Badge>}
                {paper.code_links.length > 0 && (
                  <Badge variant="green">{paper.code_links.length} repo{paper.code_links.length > 1 ? "s" : ""}</Badge>
                )}
              </div>

              <Link
                href={`/papers/${paper.arxiv_id}`}
                className="text-lg font-semibold text-gray-900 hover:text-brand-600 block mb-1"
              >
                {paper.title}
              </Link>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {truncate(paper.abstract, 200)}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                <span>
                  {paper.authors.slice(0, 3).map((a) => a.name).join(", ")}
                  {paper.authors.length > 3 ? " et al." : ""}
                </span>
                <span className="mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                  {paper.arxiv_id}
                </span>
                <span>{formatYear(paper.published_date)}</span>
                {totalStars > 0 && <span>★ {totalStars.toLocaleString()}</span>}
                <a
                  href={arxivUrl(paper.arxiv_id)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-brand-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={12} />
                  arXiv
                </a>
                {officialRepo && (
                  <a
                    href={officialRepo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-brand-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={12} />
                    {officialRepo.framework ?? "Code"}
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
