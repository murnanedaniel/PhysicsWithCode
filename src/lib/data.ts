import domainsRaw from "../../data/domains.json"
import tasksRaw from "../../data/tasks.json"
import datasetsRaw from "../../data/datasets.json"
import modelsRaw from "../../data/models.json"
import papersRaw from "../../data/papers.json"
import resultsRaw from "../../data/results.json"

// --- Types ---

export type Domain = {
  id: number
  slug: string
  name: string
  parent_id: number | null
  description: string
  children?: Domain[]
}

export type Metric = {
  name: string
  higher_is_better: boolean
  unit?: string
}

export type Task = {
  id: number
  slug: string
  name: string
  description: string
  domain_id: number | null
  metrics: Metric[]
}

export type Dataset = {
  id: number
  slug: string
  name: string
  description: string
  format: string | null
  size_gb: number | null
  homepage_url: string | null
  download_url: string | null
  domain_id: number | null
  task_ids: number[]
}

export type MLModel = {
  id: number
  slug: string
  name: string
  full_name: string | null
  code_url: string | null
  introduced_year: number | null
}

export type Author = {
  name: string
  affiliation: string | null
}

export type CodeLink = {
  url: string
  stars: number
  framework: string | null
  is_official: boolean
}

export type Paper = {
  id: number
  arxiv_id: string
  title: string
  abstract: string
  published_date: string | null
  venue: string | null
  authors: Author[]
  task_ids: number[]
  dataset_ids: number[]
  model_id: number | null
  code_links: CodeLink[]
}

export type Result = {
  id: number
  task_id: number
  dataset_id: number
  paper_id: number
  model_id: number | null
  metric_values: Record<string, number>
  is_sota: boolean
  verified: boolean
  submitted_at: string
}

// --- Raw data casts ---

export const domains = domainsRaw as Domain[]
export const tasks = tasksRaw as Task[]
export const datasets = datasetsRaw as Dataset[]
export const models = modelsRaw as MLModel[]
export const papers = papersRaw as Paper[]
export const results = resultsRaw as Result[]

// --- Lookup helpers ---

export function getDomain(id: number | null): Domain | undefined {
  if (id === null) return undefined
  return domains.find((d) => d.id === id)
}

export function getTask(slug: string): Task | undefined {
  return tasks.find((t) => t.slug === slug)
}

export function getDataset(slug: string): Dataset | undefined {
  return datasets.find((d) => d.slug === slug)
}

export function getPaper(arxivId: string): Paper | undefined {
  return papers.find((p) => p.arxiv_id === arxivId)
}

export function getModel(id: number | null): MLModel | undefined {
  if (id === null) return undefined
  return models.find((m) => m.id === id)
}

export function getResultsForTask(taskId: number): Result[] {
  return results.filter((r) => r.task_id === taskId)
}

export function getResultsForPaper(paperId: number): Result[] {
  return results.filter((r) => r.paper_id === paperId)
}

export function getDomainTree(): Domain[] {
  const roots = domains.filter((d) => d.parent_id === null)
  const addChildren = (node: Domain): Domain => ({
    ...node,
    children: domains
      .filter((d) => d.parent_id === node.id)
      .map(addChildren),
  })
  return roots.map(addChildren)
}

export function getStats() {
  return {
    papers: papers.length,
    tasks: tasks.length,
    datasets: datasets.length,
    models: models.length,
    results: results.length,
  }
}
