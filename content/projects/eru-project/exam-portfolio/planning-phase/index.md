---
title: "01 - Planning Phase"
description: "Planning phase of the eru exam portfolio."
date: 2026-04-07
weight: 1
showWordCount: true
showReadingTime: true
---

<div class="exam-portfolio-nav">
  <a class="exam-portfolio-nav__link" href="../">Overview</a>
  <a class="exam-portfolio-nav__link exam-portfolio-nav__link--current" href="../planning-phase/">01</a>
  <a class="exam-portfolio-nav__link" href="../jpa-basics/">02</a>
  <a class="exam-portfolio-nav__link" href="../jpa-basics-and-relations/">03</a>
  <a class="exam-portfolio-nav__link" href="../data-integration/">04</a>
  <a class="exam-portfolio-nav__link" href="../rest-api/">05</a>
  <a class="exam-portfolio-nav__link" href="../rest-and-test/">06</a>
  <a class="exam-portfolio-nav__link" href="../security/">07</a>
  <a class="exam-portfolio-nav__link" href="../deployment/">08</a>
</div>

## Overview

The foundation of any project is a solid **planning phase**, because writing code from the get-go is rarely the best place to start. I had to find a project idea that was both **realistic** given the timeframe we had, but also **fun to build**, an idea that I thought was useful, at least to me.

I needed something **small enough to finish**, but also rich enough to support the technologies we would keep adding throughout the semester.

After thinking through a few possibilities, including an email sorter, which I am glad I did not choose, and what I now call [*eru*](../what-is-eru/), a backend for a learning-focused content platform, or as I like to call it, a **Healthy Doom Scroller**, I naturally went with the most interesting choice.

## Early Scope

And now the real planning begins. So, what does a **Healthy Doom Scroller** need?

Let’s break it down with a very primitive **user story**:

**As a user, I would like to look at interesting and/or educational content and be able to interact with it somehow, depending on what I think of it.**

And what better way to begin than by putting the idea on a “piece of paper”?

## Early Domain Sketch

This is the early concept I came up with.

{{< mermaid >}}
flowchart TD
    User --> Interaction
    Interaction --> Content
    User --> Role
    Content --> Category
{{< /mermaid >}}

Even though this was only a **rough sketch**, I do not think much will change. It seems fairly straightforward.

- a user model
- a user interaction model
- a content model
- some form of categorization and structure

## Final Thoughts on the First Week

The biggest lesson I took from my previous projects was that a strong semester project does not need to be huge. It needs to be **well-scoped and able to evolve**. I think choosing a smaller but coherent idea early will make the rest of the semester much more pleasant.

<div class="exam-portfolio-pagination">
  <a role="button" href="../">Back To Overview</a>
  <a role="button" href="../jpa-basics/">Next Chapter</a>
</div>
