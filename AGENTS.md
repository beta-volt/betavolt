# 🏛️ BetaVolt — B2B Contracting & Electromechanical Infrastructure Platform

## 1. System Identity & Mission
BetaVolt is an enterprise B2B contracting and engineering operations platform built for Saudi mega-infrastructure initiatives (Data Centers, Smart Building BMS, Low Current Systems, and Industrial Automation).

## 2. Core Architecture & Tech Stack
* **Framework:** Next.js 15.1.6 (App Router), React 19, TypeScript
* **Internationalization:** next-intl (Bilingual: English `/en` & Arabic `/ar`)
* **Styling & UI:** Tailwind CSS, Lucide Icons, Headless UI
* **Backend & Persistence:** Supabase (PostgreSQL, Row-Level Security, Storage Buckets, Auth)
* **Hosting & Edge:** Vercel Serverless Edge, NoorNet DNS (`betavolt.com.sa`)

## 3. Key Operational Systems
* **Public B2B Portal:** Dynamic service pages, project case studies, and bilingual RFP quotation modal.
* **Administrative Command Center (`/admin`):** Content management, inquiry review, analytics, user RBAC (`super_admin`, `content_manager`, `sales`).
* **Inquiry Ingestion Pipeline:** Customer RFPs & contact messages stored in Supabase with revalidation.

---

<!-- betavolt_governance_protocol -->
# MANDATORY PROJECT PROTOCOL: `AGENT_RULES.md`

Whenever working inside or executing tasks related to `betavolt`:

1. **Mandatory Pre-Execution Check (Before Any Action / Code Change / DB Action):**
   - Automatically read `AGENT_RULES.md` at the project root.
   - Automatically check the latest entry in `tasks/INDEX.md` to identify the next task index (`TASK-XXX`).

2. **Strict 4-Phase Task Lifecycle Protocol:**
   Every non-trivial engineering task, refactoring, audit, or feature addition must have a dedicated folder in `tasks/TASK-XXX-<slug>/` containing:
   - **Phase A (`SPEC.md`):** Triage, objective, target files, binary acceptance criteria.
   - **Phase B (`SKILLS_USED.md`):** Mobilize appropriate skills from `.agents/skills/`.
   - **Phase C (`EXECUTION.log`):** Chronological command, AST audit, and execution trace.
   - **Phase D (`POST_MORTEM.md`):** Architectural decisions (ADRs), discoveries, verification checklist, and append row to `tasks/INDEX.md` marking status `✅ Completed`.

3. **Git Shielding & Internal Hygiene:**
   - Ensure all internal task infrastructure (`.agents/`, `.gemini/`, `tasks/`, `AGENT_RULES.md`, `SYSTEM_ARCHITECTURE_DOSSIER.md`, `skills-lock.json`, `scratch/`, `*.log`, `PROJECT_CREDENTIALS.md`) remains strictly shielded in `.gitignore`.
<!-- betavolt_governance_protocol -->
