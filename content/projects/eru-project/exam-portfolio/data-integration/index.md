---
title: "04 - Implementing OpenAI's API"
description: "Implementing OpenAI's API phase of the eru exam portfolio."
date: 2026-04-07
weight: 4
showWordCount: true
showReadingTime: true
---

<div class="exam-portfolio-nav">
  <a class="exam-portfolio-nav__link" href="../">Overview</a>
  <a class="exam-portfolio-nav__link" href="../planning-phase/">01</a>
  <a class="exam-portfolio-nav__link" href="../jpa-basics/">02</a>
  <a class="exam-portfolio-nav__link" href="../jpa-basics-and-relations/">03</a>
  <a class="exam-portfolio-nav__link exam-portfolio-nav__link--current" href="../data-integration/">04</a>
  <a class="exam-portfolio-nav__link" href="../rest-api/">05</a>
  <a class="exam-portfolio-nav__link" href="../rest-and-test/">06</a>
  <a class="exam-portfolio-nav__link" href="../security/">07</a>
  <a class="exam-portfolio-nav__link" href="../deployment/">08</a>
</div>

## Overview

At this point in the journey, I needed something new, and since we were about to really dive into APIs, I thought there was no better time to actually **implement an API into my API**. So that is what I decided to do.

The idea was simple. My thought process was to eventually have an *elaborate* button that the user could press, so that whatever content was shown on the screen could be sent to an **AI API** and **expanded on further**, whether it was a fact, theory, or quote.

I obviously needed an AI for this, so I decided to go with **OpenAI's API**, which turned out to be very affordable. The total cost was **less than 30 DKK**.

## What Was Needed in Order for It to Work

- OpenAI client integration
- a service wrapper for AI functionality
- a dedicated elaboration route
- environment-based configuration for the API key

## How the AI Flow Works

The AI integration is split into **small responsibilities** instead of being handled in one large class.

The flow looks like this:

1. a request hits the AI route
2. the controller validates the input
3. the service forwards the request
4. the client builds the OpenAI HTTP request
5. the response is parsed and returned as JSON

The request itself is simple:

```java
public record ElaborateRequestDTO(String title, String body) {
}
```

The controller receives that DTO, validates it, and calls the service:

```java
String explanation = openAiService.elaborateContent(
        request.title(),
        request.body()
);
```

In the actual controller, there is also a guard for missing AI configuration and some input validation:

```java
if (openAiService == null) {
    throw ApiException.configuration("AI integration is disabled...");
}

ElaborateRequestDTO request = ctx.bodyAsClass(ElaborateRequestDTO.class);
if (request == null || request.title() == null || request.title().isBlank()
        || request.body() == null || request.body().isBlank()) {
    throw ApiException.badRequest("Both title and body are required");
}
```

That part mattered because it kept the route **safe and predictable**. The AI endpoint should fail clearly if the input is invalid, instead of sending broken requests to the external API.

The response is also wrapped in a DTO:

```java
public record ElaborateResponseDTO(String explanation) {
}
```

That made the **API response clearer** and kept the controller output structured.

The actual prompt is built in `OpenAiClient`:

```java
String prompt = """
        Explain the following content in a simple, interesting, and educational
        way.
        Keep it concise and easy to understand.

        Title: %s

        Content:
        %s
        """.formatted(title, body);
```

That prompt is then sent to OpenAI through a plain HTTP request:

```json
{
  "title": "Gravity",
  "body": "Gravity is the force that attracts objects toward each other. It explains why objects fall toward the Earth and why planets orbit stars."
}
```

Which produces an output from the OpenAI API:

```json
{
  "explanation": "Sure!\n\n**Gravity** is like an invisible magnet that pulls things toward each other. It’s why if you drop a ball, it falls to the ground instead of flying away. It also keeps the Earth moving around the Sun, and the Moon moving around the Earth. Without gravity, everything in space would just float away! So, gravity is the reason things stick together and stay in place."
}
```

And that is the gist of it.

## Final Thoughts on the Fourth Week

The main lesson here was that **AI was not really the hard part by itself**. The real work was **designing the flow around it**:
OpenAI also has a very thorough guide for implementing their API, which made the integration process easier to understand.

<div class="exam-portfolio-pagination">
  <a role="button" href="../jpa-basics-and-relations/">Previous Chapter</a>
  <a role="button" href="../rest-api/">Next Chapter</a>
</div>
