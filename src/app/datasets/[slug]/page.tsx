import { notFound } from "next/navigation"
import Link from "next/link"
import { getDataset, getDomain, papers, tasks, results, datasets } from "@/lib/data"
import { formatSize, arxivUrl } from "@/lib/utils"
import Badge from "@/components/Badge"
import { ExternalLink, Download } from "lucide-react"

export function generateStaticParams() {
  return datasets.map((d) => ({ slug: d.slug }))
}

export default function DatasetPage({ params }: { params: { slug: string } }) {
  const ds = getDataset(params.slug)
  if (!ds) notFound()

  const domain = getDomain(ds.domain_id)
  const relatedPapers = papers.filter((p) => p.dataset_ids.includes(ds.id))
  const relatedTasks = tasks.filter((t) => ds.task_ids.includes(t.id))
  const dsResults = results.filter((r) => r.dataset_id === ds.id)

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/datasets" className="hover:text-brand-600">Datasets</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">{ds.name}</span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-3">
        <h1 className="text-3xl font-bold text-gray-900">{ds.name}</h1>
        <div className="flex gap-2 shrink-0">
          {ds.format && <Badge variant="green">{ds.format}</Badge>}
          {domain && <Badge variant="blue">{domain.name}</Badge>}
        </div>
      </div>

      <p className="text-gray-600 mb-6 leading-relaxed">{ds.description}</p>

      {/* Metadata */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ds.format && (
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Format</div>
            <div className="font-semibold text-gray-900">{ds.format}</div>
          </div>
        )}
        {ds.size_gb !== null && (
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Size</div>
            <div className="font-semibold text-gray-900">{formatSize(ds.size_gb)}</div>
          </div>
        )}
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Results</div>
          <div className="font-semibold text-gray-900">{dsResults.length}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Papers</div>
          <div className="font-semibold text-gray-900">{relatedPapers.length}</div>
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3 mb-8">
        {ds.homepage_url && (
          <a
            href={ds.homepage_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 no-underline"
          >
            <ExternalLink size={14} />
            Homepage
          </a>
        )}
        {ds.download_url && ds.download_url !== ds.homepage_url && (
          <a
            href={ds.download_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:border-brand-300 no-underline"
          >
            <Download size={14} />
            Download
          </a>
        )}
      </div>

      {/* Leaderboards using this dataset */}
      {relatedTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Leaderboards</h2>
          <div className="space-y-2">
            {relatedTasks.map((task) => {
              const taskResults = results.filter((r) => r.task_id === task.id && r.dataset_id === ds.id)
              return (
                <Link
                  key={task.id}
                  href={`/tasks/${task.slug}`}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-brand-300 no-underline transition-colors"
                >
                  <span className="font-medium text-gray-900">{task.name}</span>
                  <span className="text-sm text-gray-500">{taskResults.length} results →</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Papers */}
      {relatedPapers.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Papers using this dataset</h2>
          <div className="space-y-3">
            {relatedPapers.map((paper) => (
              <div key={paper.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <Link href={`/papers/${paper.arxiv_id}`} className="font-medium text-gray-900 hover:text-brand-600 block mb-1">
                  {paper.title}
                </Link>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{paper.authors.slice(0, 3).map((a) => a.name).join(", ")}{paper.authors.length > 3 ? " et al." : ""}</span>
                  <span className="mono">{paper.arxiv_id}</span>
                  <a href={arxivUrl(paper.arxiv_id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 hover:text-brand-600">
                    <ExternalLink size={10} /> arXiv
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
