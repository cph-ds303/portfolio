---
title: "05 - eru = REST API"
description: "eru = REST API phase of the eru exam portfolio."
date: 2026-04-07
weight: 5
showWordCount: true
showReadingTime: true
---

<div class="exam-portfolio-nav">
  <a class="exam-portfolio-nav__link" href="../">Overview</a>
  <a class="exam-portfolio-nav__link" href="../planning-phase/">01</a>
  <a class="exam-portfolio-nav__link" href="../jpa-basics/">02</a>
  <a class="exam-portfolio-nav__link" href="../jpa-basics-and-relations/">03</a>
  <a class="exam-portfolio-nav__link" href="../data-integration/">04</a>
  <a class="exam-portfolio-nav__link exam-portfolio-nav__link--current" href="../rest-api/">05</a>
  <a class="exam-portfolio-nav__link" href="../rest-and-test/">06</a>
  <a class="exam-portfolio-nav__link" href="../security/">07</a>
  <a class="exam-portfolio-nav__link" href="../deployment/">08</a>
</div>

## Overview

With the AI somewhat in place, the next natural step was to **expose the system properly through REST endpoints**.

Until this stage, most of the work had been about **entities**, **persistence**, and **relationships**. That part was useful, but it still left one important piece missing: the **HTTP layer** that actually lets a client interact with the system in a structured way. Now, I already have some HTTP experience with the AI implementation, so this shouldn't be too bad.

## What I Added

- content controller
- content routes
- request DTOs
- response DTOs
- content service
- route registration under `/api/v1`
- cleaner startup through `ApplicationConfig` and `DependencyContainer`

The most important endpoints introduced around this phase were:

- `GET /content`
- `GET /content/{id}`
- `POST /content`
- `PUT /content/{id}`
- `DELETE /content/{id}`

This was where **REST began to make much more sense** to me in practice. Instead of only thinking in terms of methods in Java classes, I had to start thinking in terms of **resources**, **URIs**, **HTTP methods**, and **response codes**.

In *eru*, `content` became the resource, while `/content/{id}` represented one specific piece of content. The same idea later extended naturally to endpoints such as `/content/{id}/interactions` and `/auth/me`.

## DTOs and API Boundaries

One of the design decisions I liked most in this phase was keeping the **HTTP contract separate from the persistence model**. I did not want to expose JPA entities directly, because entities belong to the **database model**, while DTOs belong to the **API model**.

For content, the response DTO looks like this:

```java
public record ContentDTO(
        Integer id,
        String title,
        String body,
        ContentType contentType,
        String category,
        String source,
        String author,
        boolean active,
        LocalDateTime createdAt
) { }
```

That gave me much better control over what the client should actually see.

It also became clear that request and response shapes do not always have to be identical. Authentication is a simple example of that:

```java
public record RegisterRequestDTO(
        String firstName,
        String lastName,
        String email,
        String username,
        String password
) {
}
```

```java
public record AuthResponseDTO(String token, Integer userId, String username) {
}
```

That is a small but important example of why **DTO separation matters**. A password belongs in an incoming request, but obviously not in a response.

## Route Structure

Another important improvement was **separating route registration into dedicated route classes**. Instead of putting everything in one place, I used `Routes` as the entry point and then delegated to classes such as `ContentRoutes`, `AuthRoutes`, and `InteractionRoutes`.

One example from `ContentRoutes` looks like this:

```java
routes.post("/content", contentController::create, AppRole.ADMIN);
routes.get("/content", contentController::getAll, AppRole.ANYONE);
routes.get("/content/{id}", contentController::getById, AppRole.ANYONE);
routes.put("/content/{id}", contentController::update, AppRole.ADMIN);
routes.delete("/content/{id}", contentController::delete, AppRole.ADMIN);
```

This gave me practical experience with how Javalin maps HTTP methods to route handlers:

- `GET` for reading resources
- `POST` for creating new resources
- `PUT` for updating existing resources
- `DELETE` for removing resources

That sounds simple, but it was actually one of the points where **REST started to click** for me. The HTTP method itself communicates **intent**, so the API becomes easier to understand both for me and for whoever might use it.

I also liked that each route class is responsible for one small area of the API. If I want to change how content behaves, I know where to look, and I do not have to dig through one giant route file.

## Request Handling and Validation

Another important thing I learned in this phase was how much the Javalin `Context` object actually does.

Inside the controllers, I used `ctx` to:

- parse request bodies with `ctx.bodyAsClass(...)`
- read path parameters with `ctx.pathParam("id")`
- read query parameters with `ctx.queryParam(...)`
- set status codes with `ctx.status(...)`
- return JSON with `ctx.json(...)`

For example, the content list endpoint supports filtering through query parameters:

```java
String typeParam = ctx.queryParam("type");
String activeOnlyParam = ctx.queryParam("activeOnly");
```

That made the API feel much more practical. Instead of creating separate routes for every variation, I could support:

- `GET /api/v1/content`
- `GET /api/v1/content?type=FACT`
- `GET /api/v1/content?activeOnly=true`

I also ended up with a validation split that I think makes sense architecturally.

The controller deals with HTTP-shaped concerns such as parsing input and extracting parameters, while the service layer handles the actual request validation:

```java
private static void validateRequest(ContentRequestDTO request) {
    if (request == null) {
        throw ApiException.badRequest("Request body is required");
    }
    if (request.title() == null || request.title().isBlank()) {
        throw ApiException.badRequest("Title is required");
    }
    if (request.body() == null || request.body().isBlank()) {
        throw ApiException.badRequest("Body is required");
    }
    if (request.contentType() == null) {
        throw ApiException.badRequest("Content type is required");
    }
}
```

I liked this split because it kept the **controllers thinner** while still making the **validation rules explicit**.

## Cleaning Up the App Structure

This phase also turned into a bit of a refactor.

As the project grew, I did not want `Main` to become a **long list of object creation, route wiring, and configuration code**. So I moved those responsibilities into `ApplicationConfig` and `DependencyContainer`.

That meant:

- `Main` stays small and only starts the application
- `DependencyContainer` handles object creation and wiring
- `ApplicationConfig` handles Javalin setup, routes, logging, and exception handling

I think this was one of the **more valuable decisions** of the phase, because it made the whole project feel **more intentional** and much easier to extend.

## Final Thoughts of the Fifth Week

What I liked most about this week was that I finally got rid of the **200+ lines worth of code inside of Main**, and i'm quite the structured person myself, so it felt good, even though it was somewhat of a rookie mistake to begin with.
Nonetheless, DTOs, controllers, routes, exception handling, and the cleaned-up app configuration were in place, *eru* started feeling **much more coherent** and much closer to what I would describe as a **proper REST API**.

<div class="exam-portfolio-pagination">
  <a role="button" href="../data-integration/">Previous Chapter</a>
  <a role="button" href="../rest-and-test/">Next Chapter</a>
</div>
