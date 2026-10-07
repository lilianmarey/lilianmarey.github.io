---
title: "Edge-Girth as a Structural Edge Feature for Graph Neural Networks"
collection: publications
category: workshops
permalink: /publication/2026-09-01-EDGE-GIRTH-GNN
excerpt: 'The edge-girth of each edge, with its multiplicity, as a structural feature for message-passing graph neural networks, and a proof of when this descriptor stops being informative.'
date: 2026-09-01
authors: 'Lilian Marey, Charlotte Laclau'
venue: 'NeurIPS 2026 Workshop: Bridging Optimal Transport, Learning and Structured Data: Toward Geometric Distributional Learning (non-archival)'
links:
  - { label: pdf, url: 'https://arxiv.org/pdf/2609.01441' }
  - { label: arxiv, url: 'https://arxiv.org/abs/2609.01441' }
citation: '<strong>Lilian Marey</strong>, Charlotte Laclau. Edge-Girth as a Structural Edge Feature for Graph Neural Networks. NeurIPS 2026 Workshop: Bridging Optimal Transport, Learning and Structured Data: Toward Geometric Distributional Learning (non-archival), 2026.'
abstract: >-
  Graph neural networks (GNN) based on message passing are provably no more powerful than the one-dimensional Weisfeiler–Leman colour-refinement test (1-WL): two graphs it cannot tell apart receive identical representations, however deep or wide the network. A common remedy augments node or edge features with precomputed structural descriptors, most often counts of a fixed small subgraph such as triangles or longer cycles, but such counts require committing in advance to the size of the substructure counted, a choice usually made blind to the data. We study a descriptor that avoids this choice. The edge-girth of an edge is the length of a shortest cycle through it, and its multiplicity is the number of such shortest cycles; together they form a per-edge invariant that reports cycles of arbitrary length, computable exactly by a single breadth-first search per edge. Injected into a gated message-passing architecture, EGAGNN, it reaches a test MAE a factor three below the closest gated comparator on the ZINC-12k regression benchmark at 104k parameters; against bounded cycle-counting descriptors under the same architecture, it matches only a dictionary counting cycles up to length eight, using twice as many channels, while a dictionary capped at length four performs no better than no structural information at all. On graph discrimination we prove a matching limitation: on graphs where every edge sees the same number of shortest cycles of the same length, the descriptor becomes constant and any model built on it collapses back to the 1-WL bound. This holds without exception across all 400 pairs of the BREC benchmark: not one of the 90 such pairs is distinguished.
---
