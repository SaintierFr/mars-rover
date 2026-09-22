# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is a coding-dojo project ("Dojo SDLC AI-native — Agile en Seine") for building a Mars Rover
simulator. The repository currently only contains the **Intent** and **Design (spec)** artifacts
produced by the SDLC workflow described below — there is no Python implementation yet, and
therefore no build, lint, or test commands to run. Once implementation code lands, this file
should be updated with the actual commands.

## SDLC workflow: Intent → Spec → Build

This repo follows a staged, document-driven SDLC where each phase is gated by explicit human
(Product Owner) approval, enforced via custom Claude Code skills in `.claude/skills/`. Do not
skip phases or invent decisions on the Product Owner's behalf — every ambiguity is tracked as an
open question or a "réserve" (reservation) until a human answers it.

1. **Intent** (`.claude/skills/intent/SKILL.md`, invoked conversationally, not a slash command)
   - Produces `intent/<slug>/intent.md`: problem, proposed outcome, users/systems concerned,
     constraints, and open questions.
   - Never decides product direction or invents constraints on the author's behalf; unresolved
     points stay under "Questions ouvertes".
   - Requires explicit validation of the drafted content before creating a branch
     (`claude/intent-<slug>`) or writing the file. Nothing is committed/pushed/PR'd without a
     further explicit confirmation, and the skill never merges its own PR.

2. **Spec / Design** (`.claude/skills/spec/SKILL.md`, invoked via `/spec <path-to-intent.md>`)
   - Produces `spec.md` alongside the referenced `intent.md`, containing: périmètre (scope),
     numbered requirements (`EX-01`, `EX-02`, ...) each with an origin, expected behavior, and a
     given/action/expected-result scenario, a proposed design, "Réserves" (open design
     ambiguities with origin/impact/decision needed), tracked open questions, and a
     "Contexte de génération" section recording the exact prompt and the git commit hash of every
     skill version used to produce the document.
   - Only proceeds against an *accepted* intent (accepted = merged to `main` via PR, verified in
     the PR decision, not just file presence). Works on a dedicated branch, one created fresh
     from `main` if starting from `main`.
   - Resolves reservations and open questions one at a time with the Product Owner, never
     advancing to the next until the current one is answered; unanswered ones remain open and are
     carried forward with their effect on the Build phase noted.
   - Only commits/pushes/opens a PR once the Product Owner explicitly agrees the spec is ready to
     propose, and never merges that PR itself.

3. **Build** — not started in this repository yet. When implementing, no separate skill exists
   for this phase in this repo; follow the accepted `spec.md` requirements directly.

When asked to work on intent or spec documents, read `.claude/skills/intent/SKILL.md` or
`.claude/skills/spec/SKILL.md` in full before acting — they contain the precise rules (question
order, draft template, save/PR sequencing) that govern the interaction.

## Current specified behavior (from `intent/mars-rover-simulator/`)

The accepted spec (`intent/mars-rover-simulator/spec.md`) currently describes the target program.
Treat these as authoritative decisions already made by the Product Owner (each traceable to a
`R-xx` reservation in the spec) rather than open design choices:

- CLI program in Python, reading the map, starting point/orientation, and command string from
  **stdin** (exact line layout still unspecified — a Build-time detail).
- Rover state = position `(x, y)` + orientation ∈ `{N, S, E, W}`.
- Axes: North = increasing `y`, East = increasing `x`.
- Commands are a concatenated string of single letters: `A` (advance), `D` (turn right), `G`
  (turn left, "gauche"). Right turns advance one step in `N→E→S→O→N`; left turns step the other
  way.
- Map obstacles use one of two symbol pairs: `🟩` free / `🌳` obstacle, or `🟫` free / `🪨`
  obstacle.
- The map boundary behaves like an obstacle: an `A` that would leave the grid or land on an
  obstacle cell leaves the rover in place (position and orientation both unchanged); each command
  is still evaluated independently, so a blocked `A` doesn't affect subsequent commands.
- Output: a single compact line `x y orientation` (e.g. `2 3 S`) after the whole command string
  has been processed.

Still open per the spec: the exact stdin layout (order/separators of map, start point, and
commands), and dojo timing/authorship metadata — neither blocks implementation.

## Erreurs récurrentes

Lorsqu’une même erreur se répète deux fois, propose une instruction courte et précise pour l’éviter. Appuie-toi sur les erreurs observées et fais valider cette instruction avant de l’ajouter à CLAUDE.md.

Si une instruction devient obsolète, propose sa correction ou son retrait et attends la validation avant de modifier le fichier.
