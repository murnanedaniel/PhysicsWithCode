import Link from "next/link"
import { datasets, getDomain } from "@/lib/data"
import { formatSize } from "@/lib/utils"
import Badge from "@/components/Badge"

const formatColors: Record<string, "green" | "blue" | "orange" | "gray"> = {
  HDF5: "green",
  NetCDF: "blue",
  NPY: "orange",
  CSV: "gray",
  ROOT: "orange",
}

export default function DatasetsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Datasets</h1>
        <p className="text-gray-500 mt-1">{datasets.length} physics ML datasets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {datasets.map((ds) => {
          const domain = getDomain(ds.domain_id)
          return (
            <Link
              key={ds.id}
              href={`/datasets/${ds.slug}`}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-brand-300 transition-colors no-underline block"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="font-semibold text-gray-900">{ds.name}</h2>
                <div className="flex gap-1.5 shrink-0 flex-wrap">
                  {ds.format && (
                    <Badge variant={formatColors[ds.format] ?? "gray"}>{ds.format}</Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{ds.description}</p>

              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                {domain && <Badge variant="blue">{domain.name}</Badge>}
                {ds.size_gb !== null && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded">{formatSize(ds.size_gb)}</span>
                )}
                {ds.homepage_url && (
                  <span className="text-brand-500">Download available</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
