---
title: "03 - Relationship Challenges"
description: "Relationship challenges phase of the eru exam portfolio."
date: 2026-04-07
weight: 3
showWordCount: true
showReadingTime: true
---

<div class="exam-portfolio-nav">
  <a class="exam-portfolio-nav__link" href="../">Overview</a>
  <a class="exam-portfolio-nav__link" href="../planning-phase/">01</a>
  <a class="exam-portfolio-nav__link" href="../jpa-basics/">02</a>
  <a class="exam-portfolio-nav__link exam-portfolio-nav__link--current" href="../jpa-basics-and-relations/">03</a>
  <a class="exam-portfolio-nav__link" href="../data-integration/">04</a>
  <a class="exam-portfolio-nav__link" href="../rest-api/">05</a>
  <a class="exam-portfolio-nav__link" href="../rest-and-test/">06</a>
  <a class="exam-portfolio-nav__link" href="../security/">07</a>
  <a class="exam-portfolio-nav__link" href="../deployment/">08</a>
</div>

## Overview

This week I really had to think about the **entity relationships** in the database, more so in terms of understanding all of the different relationship types. Do I model this as **many-to-many**, **many-to-one**, or perhaps **one-to-one**? This took unbelievable brainpower, to the point where I had to call in support from Codex to make sure I was doing the right thing.

## Users and Interactions

I introduced `UserInteraction` as its own entity rather than storing likes or bookmarks directly on `User` or `Content`.

By making interaction its own entity, I could represent:

- which user made the interaction
- what content it belongs to
- what kind of reaction it was
- when it happened

```java
@Entity
@Table(
        name = "user_interactions",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_interaction_user_content",
                        columnNames = {"user_id", "content_id"}
                )
        }
)
public class UserInteraction {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;
}
```

Note: I'm using `FetchType.LAZY` here because it avoids loading related data unless it is actually needed.

## Final Thoughts on the Third Week

This week taught me that **relationships are hard**, and it's even harder when your job is to fire the correct Cupid arrows at the right entities, because otherwise the result is **wrong domain logic**, and no one wants that.

<div class="exam-portfolio-pagination">
  <a role="button" href="../jpa-basics/">Previous Chapter</a>
  <a role="button" href="../data-integration/">Next Chapter</a>
</div>
