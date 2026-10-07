---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Research interests
======
Graph theory, combinatorics, graph machine learning, expressivity of graph neural networks, fairness in machine learning, user modeling.

Education
======
* **Ph.D. candidate, Télécom Paris**, Paris, France, 2024 – 2027 (defense planned for January 2027)
  * *Predicting Edges, Constraining Edges: From Fairness in Link Prediction to Edge-Girth Realizability*
  * Advisors: Charlotte Laclau, Tiphaine Viard, Bruno Sguerra
  * Research area: graph theory, combinatorics, machine learning, algorithmic fairness
* **Master's degree MVA (Mathematics, Vision, Learning), ENS Paris-Saclay**, Paris, France, 2022 – 2023
  * Relevant courses: convex optimization, kernel methods for machine learning, deep learning, time series analysis, image denoising, introduction to digital imaging, deep learning in practice
* **Engineering degree, ENSAE Paris** (Data Science, Statistics and Learning), Palaiseau, France, 2019 – 2023
  * Relevant courses: Bayesian statistics, machine learning theory, reinforcement learning, Monte Carlo methods, optimization

Internships
======
* **Deezer Research**, Paris, France, May – November 2023
  * Music taste modeling: user embeddings based on listening regularities
  * Encoding user activity into time series, pattern detection through dictionary learning
  * Supervisors: Bruno Sguerra, Manuel Moussallam
* **Louis Bachelier Institute**, Paris, France, September 2021 – March 2022
  * Natural language processing: sentence embeddings, sentiment analysis, topic modeling
* **CETIC**, Charleroi, Belgium, May – August 2021
  * Hybrid CNN and LSTM neural networks for the detection of stenoses in coronary arteries from X-ray images
  * Supervisor: Xavier Lessage

Publications
======
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>

Presentations
======
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html %}
  {% endfor %}</ul>

Teaching
======
  <ul>{% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>

Skills
======
* Languages: French, English, Spanish
* Computational tools: exhaustive graph generation and verification of constructions (networkx, nauty)
* Programming: Python (numpy, PyTorch, scikit-learn, pandas)
