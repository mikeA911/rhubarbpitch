---
title: "The Problem with 'Just Use AI' in Healthcare"
date: "2025-12-24"
excerpt: "Why Rhubarb chose expert-curated knowledge over generic AI models for rural healthcare solutions."
author: "Rhubarb Team"
---

## The Problem with "Just Use AI" in Healthcare
### *And Why Rhubarb Took a Different Path*

If you’ve spent any time building or deploying AI products lately, you’ve probably heard some version of this:

> “Why don’t we just use GPT for that?”

On the surface, it’s a reasonable question. Modern LLMs are powerful, articulate, and broadly knowledgeable. They can explain FHIR, summarize value-based care models, and even outline grant strategies.

But if you’ve actually tried to use those answers in a real rural clinic, you’ve likely hit the same wall we did.

* The answers are **fluent**.
* They’re often **technically correct**.
* And yet—they’re frequently **unusable**.

That gap is exactly why Rhubarb exists.

---

### General AI Models Are Optimized for Plausibility, Not Practice

Commercial LLMs are trained to predict likely next tokens and generalize across massive datasets. They are **not** trained to:

* Respect local operational constraints.
* Know which steps are unrealistic for a 5-provider clinic.
* Distinguish “policy-compliant” from “deployable.”
* Encode institutional memory or lived experience.

![IMAGE: Infographic comparing "Theoretical AI Advice" vs. "Real-world Constraints"]

So you end up with answers like: *"Implement full FHIR R4 APIs across all systems"* or *"Adopt a mature value-based care risk model."* All technically valid—all frequently impractical.

---

### The Aha Moment: The Problem Isn’t the Model — It’s the Knowledge

Rhubarb didn’t start by asking “Which AI model should we use?” We started by asking: **“Where does real rural healthcare knowledge actually live?”**

The answer wasn’t in model weights. It was in **people**:

* Professionals who have implemented EHRs in underfunded clinics.
* Specialists who have navigated FHIR with legacy systems.
* Operators who understand VBC at small scale.

That experience is fragmented, mostly undocumented, and often lost when a project ends. Instead of letting AI hallucinate expertise, we built a system where **AI reasons over expert-curated experience.**

---

### What Rhubarb’s Knowledgebase Actually Is

Rhubarb’s knowledgebase is not a document dump or a generic RAG pipeline pointing at random content.

| What it is NOT | What it IS |
| :--- | :--- |
| A "PDF dump" | Curated by top professionals in the field |
| Generic training | Structured around real workflows (EHR, FHIR, VBC) |
| Static data | Annotated with context, constraints, and failure modes |

**The commercial LLM is the reasoning engine. The knowledgebase is the source of truth.**

![IMAGE: Diagram showing the Rhubarb Architecture: Expert Knowledge + LLM Reasoning = Actionable Guidance]

---

### Why This Beats a General AI Model

#### 1. Constrained Intelligence > Broad Intelligence
A general AI answers: *“Here’s how FHIR should work.”*
Rhubarb answers: *“Here’s how FHIR actually works in clinics with your size, staff, and EHR—and here’s what to avoid.”*

#### 2. Experience Is Composable, Models Are Not
With a curated knowledgebase, new insights can be added immediately and edge cases don’t get averaged away. You don’t retrain a model every time reality changes; you update the knowledge it reasons over.

#### 3. Human-in-the-Loop Is a Feature
Rhubarb is designed so that experts remain accountable for quality, while AI handles the heavy lifting of drafting and summarizing. This creates a system that improves without drifting.

#### 4. Trust Comes from Traceability
When an answer comes from known contributors and documented real-world outcomes, users trust it. In healthcare, “sounds right” is never good enough.

---

### Incremental Intelligence, Not One-Time Training

Over time, Rhubarb’s knowledgebases can inform incremental fine-tuning—but only after the signal is strong. This ensures the model becomes aligned with rural healthcare realities without sacrificing the stability of commercial LLMs. 

**In short: knowledge evolves first, models adapt second.**

![IMAGE: Visual timeline showing the evolution of Knowledge leading to Model refinement]

---

### The Takeaway

The future of applied AI is not bigger models—it’s **better knowledge**.

* A general AI model can **explain** healthcare systems.
* Rhubarb helps you **operate** within them.

That difference isn’t magic. It’s architecture. And once you see it, it’s hard to unsee.