---
title: "04 - Beyond the Frontend"
description: "The final phase of the eru frontend process."
date: 2026-05-12
weight: 4
showWordCount: true
showReadingTime: true
---

<div class="exam-portfolio-nav">
  <a class="exam-portfolio-nav__link" href="../">Overview</a>
  <a class="exam-portfolio-nav__link" href="../square-one/">01</a>
  <a class="exam-portfolio-nav__link" href="../react-set-go/">02</a>
  <a class="exam-portfolio-nav__link" href="../route-awakening/">03</a>
  <a class="exam-portfolio-nav__link exam-portfolio-nav__link--current" href="../beyond-the-frontend/">04</a>
</div>

## Overview

Welcome to the final page of the frontend development process of *eru*.

This page will be a little different from the previous ones. Instead of focusing entirely on React patterns, routes, state management, or frontend architecture, I want to spend some time reflecting on where the project could go next and what I learned from building it.

Because honestly, I do not think I will ever truly "finish" *eru*.

Every time I solved one problem, I immediately started noticing three new things I wanted to improve. And weirdly enough, that became one of the biggest lessons of the entire project.

You can have a vision for a million different features, ideas, and improvements, but if you start building the house from the roof down, that is when the really unexpected problems begin appearing.

Because once the roof is already built, growing the foundation underneath it suddenly becomes impossible without restructuring everything.

I think that was one of the most valuable things I learned throughout this project:

In the end, it is not only about building features, it is also about building structure that can continue growing without collapsing under its own weight.

## Improvements

Below is a list of improvements and features I would still like to implement into *eru* in the future.

### Account Management

To start with, users currently cannot change their account credentials, such as their username or email.

This is something that completely slipped my mind during development.

Right now, the backend does not even expose a route for handling account updates properly. What I am essentially missing is something like:

```http
PATCH /auth/me
```

The frontend itself would not actually be that difficult to build. The bigger issue is designing the backend flow properly:

* validating changes
* preventing duplicate usernames
* handling email updates
* and making sure JWT/session state still behaves correctly afterwards

It is one of those features that sounds very simple until you actually start thinking about all the edge cases attached to user accounts.

---

### Making the Platform More Immersive

Another thing I started noticing over time is that the UI can eventually become a bit repetitive.

The content itself may be interesting, but endlessly scrolling through cards and text can still become visually predictable after a while.

That made me realise that *eru* should probably evolve into something more immersive than it currently is.

One of the ideas I would love to experiment with is adding animations and visual demonstrations for scientific concepts.

For example:

* gravitational theories could be visualised directly on screen
* wave behaviour could animate in real time
* planetary motion could become interactive
* and certain scientific concepts could become explorable instead of only readable

The goal would not just be "making things look cool".

The real goal would be making information easier to remember and easier to understand.

I also started thinking a lot more about presentation.

If a user opens a quote from Albert Einstein, I do not want it to just appear as plain text inside a content card forever. I would rather present it in a more memorable way:

* where the quote originated from
* why it mattered
* what historical context surrounded it
* and how it connects to the rest of the platform

Basically, I want content to feel more alive.

---

### Dedicated Author and Scientist Pages

Another feature I would really like to add is dedicated pages for scientists, authors, and historical figures.

Right now, authors mostly exist as text labels attached to content.

But ideally, clicking an author name would open an actual profile page containing:

* who they were
* what they contributed to science
* interesting facts about them
* related theories
* related quotes
* and connected content across the platform

The same idea could also extend to:

* theories
* discoveries
* concepts
* historical events
* and scientific movements

In a way, I want *eru* to eventually feel less like a collection of isolated cards and more like a connected knowledge system where everything links together naturally.

---

### Better Frontend Structure

One thing I would also improve long term is the frontend structure itself.

Right now, the project is still manageable, but as more features get added, I can already feel where things would eventually need refactoring.

Especially:

* CSS organization *(because holy cow it's a mess)*

What I should've done was split the CSS into smaller page-specific files.

It will probably need refactoring in the future if I decide to continue the *eru* journey.

## Final Thoughts on the Fourth Frontend Week

I think the biggest thing I learned during this frontend process is that frontend development is much more architectural than I originally expected.

At first it looked deceptively simple from the outside:
buttons, pages, forms, colors, animations.

But underneath all of that sits:
state management, routing, authentication, rendering logic, deployment, and countless small UX decisions constantly interacting with each other.

And somehow, all of those moving pieces still have to work together without the application collapsing into complete chaos.

So maybe... I was Kamaji all along.

![Kamaji GIF](/images/Kamaji.gif)

<div class="exam-portfolio-pagination">
  <a role="button" href="../route-awakening/">Previous Chapter</a>
  <a role="button" href="../">Back To Overview</a>
</div>
