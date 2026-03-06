# PhysicsWithCode — Implementation Plan

## Architecture: Single Next.js Static Site → GitHub Pages

No backend. No Docker. No database. Pure Next.js with data in JSON files.

```
/home/user/PhysicsWithCode/
├── data/                        # Seed data as JSON files (source of truth)
│   ├── domains.json
│   ├── papers.json
│   ├── tasks.json
│   ├── datasets.json
│   ├── models.json
│   └── results.json
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Home: hero + stats + trending
│   │   ├── papers/
│   │   │   ├── page.tsx
│   │   │   └── [arxiv_id]/page.tsx
│   │   ├── tasks/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx  # Leaderboard (signature page)
│   │   ├── datasets/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── PaperCard.tsx
│   │   ├── LeaderboardTable.tsx
│   │   ├── DatasetCard.tsx
│   │   └── Badge.tsx
│   └── lib/
│       ├── data.ts              # Typed loaders: import from ../../data/*.json
│       └── utils.ts
│
├── package.json
├── next.config.js               # output: 'export', basePath for GitHub Pages
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
│
└── .github/
    └── workflows/
        └── deploy.yml           # push → npm run build → deploy out/ to gh-pages
```

## Key Decisions

- **`output: 'export'`** in `next.config.js` — fully static HTML/CSS/JS in `out/`
- **Data import at build time** — pages do `import papers from '../../../data/papers.json'`
- **`generateStaticParams`** pre-renders all dynamic routes (`[arxiv_id]`, `[slug]`)
- **GitHub Actions** builds and pushes `out/` to `gh-pages` branch

## Data Schema

**data/domains.json**
```json
[{ "id": 1, "slug": "fluid-dynamics", "name": "Fluid Dynamics", "parent_id": null, "description": "..." }]
```

**data/tasks.json**
```json
[{
  "id": 1, "slug": "navier-stokes", "name": "Navier-Stokes (Turbulence)",
  "description": "...", "domain_id": 1,
  "metrics": [{ "name": "RMSE", "higher_is_better": false }]
}]
```

**data/datasets.json**
```json
[{
  "id": 1, "slug": "pdebench-ns", "name": "PDEBench Navier-Stokes",
  "description": "...", "format": "HDF5", "size_gb": 42,
  "homepage_url": "https://github.com/pdebench/PDEBench", "domain_id": 1
}]
```

**data/models.json**
```json
[{ "id": 1, "slug": "fno", "name": "FNO", "full_name": "Fourier Neural Operator", "code_url": "https://github.com/neuraloperator/neuraloperator" }]
```

**data/papers.json**
```json
[{
  "id": 1, "arxiv_id": "2010.08895",
  "title": "Fourier Neural Operator for Parametric PDEs",
  "abstract": "...", "published_date": "2020-10-19",
  "authors": [{ "name": "Zongyi Li", "affiliation": "Caltech" }],
  "task_ids": [1], "dataset_ids": [1],
  "code_links": [{ "url": "https://github.com/neuraloperator/neuraloperator", "stars": 3100, "framework": "PyTorch", "is_official": true }]
}]
```

**data/results.json**
```json
[{
  "id": 1, "task_id": 1, "dataset_id": 1, "paper_id": 1, "model_id": 1,
  "metric_values": { "RMSE": 0.0175 },
  "is_sota": true, "verified": true, "submitted_at": "2020-10-19"
}]
```

## MVP Seed Data (3 tasks, ~20 results)

1. **Navier-Stokes** — PDEBench: FNO (SOTA), U-Net, ResNet
2. **Weather Forecasting** — WeatherBench2: Pangu-Weather (SOTA), GraphCast, IFS
3. **Molecular Dynamics** — MD17 Ethanol: NequIP (SOTA), SchNet, DimeNet++

## Implementation Steps

1. Seed JSON data in `data/`
2. `package.json`, `next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.js`
3. `src/lib/data.ts` — typed data loaders
4. `src/lib/utils.ts`
5. `src/app/globals.css` + `layout.tsx`
6. All pages (home, papers list/detail, tasks list/leaderboard, datasets list/detail)
7. All components
8. `.github/workflows/deploy.yml`
