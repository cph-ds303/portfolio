---
title: "06 - REST and Test"
description: "REST and testing phase of the eru exam portfolio."
date: 2026-04-07
weight: 6
showWordCount: true
showReadingTime: true
---

<div class="exam-portfolio-nav">
  <a class="exam-portfolio-nav__link" href="../">Overview</a>
  <a class="exam-portfolio-nav__link" href="../planning-phase/">01</a>
  <a class="exam-portfolio-nav__link" href="../jpa-basics/">02</a>
  <a class="exam-portfolio-nav__link" href="../jpa-basics-and-relations/">03</a>
  <a class="exam-portfolio-nav__link" href="../data-integration/">04</a>
  <a class="exam-portfolio-nav__link" href="../rest-api/">05</a>
  <a class="exam-portfolio-nav__link exam-portfolio-nav__link--current" href="../rest-and-test/">06</a>
  <a class="exam-portfolio-nav__link" href="../security/">07</a>
  <a class="exam-portfolio-nav__link" href="../deployment/">08</a>
</div>

## Overview

It's finally time to do some tests, at this point, the backend had **authentication**, **authorization**, and **protected routes**, which meant there were now many more ways for things to go wrong. So to make sure things don't go wrong, you make them go wrong intentionally with tests.

## What I Added

- unit tests for auth, content, and interaction services
- integration tests that start the API against a real PostgreSQL test database
- tests for register, login, logout, protected routes, and filtered interaction endpoints
- Rest Assured-based API tests with Hamcrest assertions
- helper factory for spinning up the test application

I was kind of experimenting so I ended up using **two styles of API testing** in this project:

- Java's built-in `HttpClient` together with JUnit, Jackson, and Testcontainers
- Rest Assured for more expressive endpoint and response assertions

## Testing the API from the Outside

I chose to boot the application against a **real PostgreSQL container** instead of mocking the whole stack.

```java
@Testcontainers(disabledWithoutDocker = true)
class AuthContentRoutesTest {

    @Container
    private static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("eru_test")
                    .withUsername("postgres")
                    .withPassword("postgres");
}
```

That gave me much better confidence in:

- route behavior
- JSON handling
- persistence
- security behavior

The first integration tests send actual HTTP requests to the running API with `HttpClient`:

```java
HttpResponse<String> registerResponse = sendJsonRequest(
        "POST",
        "/auth/register",
        null,
        Map.of(
                "firstName", "Student",
                "lastName", "One",
                "email", "student1@example.com",
                "username", "student1",
                "password", "secret123"
        )
);
```

I could verify the **full request flow** from HTTP request to controller to service to database and back again.

Later on, I also added Rest Assured tests, which made the endpoint assertions much cleaner.

```java
given()
        .contentType(ContentType.JSON)
        .body(registerPayload("student1", "student1@example.com"))
.when()
        .post("/auth/register")
.then()
        .statusCode(201)
        .body("username", equalTo("student1"))
        .body("token", not(blankOrNullString()));
```

This was especially useful for checking CRUD-like behavior and status codes:

- `201` when a user or content item is created
- `200` when data is returned correctly
- `204` when logout succeeds
- `401` when a protected route is called without a valid token
- `404` when a requested resource does not exist

This also gave me a much better feel for why **Rest Assured** is useful in API testing. It lets the test read almost like a description of the **HTTP contract**, especially when combined with Hamcrest matchers.

## Testing Authentication and Authorization

For protected endpoints, the tests send the **JWT** through the `Authorization` header as a **Bearer token**. That let me verify that the access rules in the routes actually worked in practice.

In the Rest Assured version, this becomes very compact:

```java
given()
        .auth().oauth2(token)
        .queryParam("reactionType", "BOOKMARK")
.when()
        .get("/interactions/me")
.then()
        .statusCode(200)
        .body("$", hasSize(1));
```

One example is the logout flow. A user first receives a token through registration or login, and after logout that same token should no longer be accepted:

```java
HttpResponse<String> logoutResponse = sendRequest("POST", "/auth/logout", token, null);
assertEquals(204, logoutResponse.statusCode());

HttpResponse<String> meResponse = sendRequest("GET", "/auth/me", token, null);
assertEquals(401, meResponse.statusCode());
```

I liked this kind of test because it checks **behavior that matters from the outside**. It is not only about whether some internal method returns true or false, but whether the API really **enforces the security rules** it claims to have.

## Final Thoughts for the Sixth Week

Working with both `HttpClient` and Rest Assured also made the difference clear to me. `HttpClient` is perfectly fine for **full integration tests**, but Rest Assured makes the **intent of API assertions** much clearer and more concise. That made it easier to connect the implementation to the actual learning goals around REST API testing.

<div class="exam-portfolio-pagination">
  <a role="button" href="../rest-api/">Previous Chapter</a>
  <a role="button" href="../security/">Next Chapter</a>
</div>
