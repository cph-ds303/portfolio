---
title: "07 - Security"
description: "Security phase of the eru exam portfolio."
date: 2026-04-07
weight: 7
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
  <a class="exam-portfolio-nav__link" href="../rest-and-test/">06</a>
  <a class="exam-portfolio-nav__link exam-portfolio-nav__link--current" href="../security/">07</a>
  <a class="exam-portfolio-nav__link" href="../deployment/">08</a>
</div>

## Overview

Security was the phase where *eru* started feeling like an **application** rather than just a content API.

Up until this point, the project had structure, persistence, and routes. But now I had to think much more seriously about access:

- who should be able to do what
- what should be public
- what should require a token
- what should be admin-only

This was a **very different type of work** than the earlier persistence and REST phases. The problem was no longer only “can the route do the thing?” but also “should this user be allowed to do the thing at all?”

What I found interesting here is that the hard part was not learning what a JWT is in theory. The hard part was **fitting authentication and authorization into an existing codebase** without turning the whole project into **“security code everywhere”**.

## What I Added

- JWT utility
- auth service
- auth controller and auth routes
- authenticated user context
- role-based route protection
- password hashing and password verification with BCrypt

Later on, I also extended this part of the system with:

- improved registration fields
- logout
- a current-user interaction overview

## JWT

One of the things I liked about JWT fairly quickly was that it gave me a compact way to carry both **identity** and **role information** in the same token.

```java
return JWT.create()
        .withIssuer(issuer)
        .withIssuedAt(now)
        .withExpiresAt(expiresAt)
        .withSubject(user.getUsername())
        .withClaim("userId", user.getId())
        .withArrayClaim("roles", roles.toArray(new String[0]))
        .sign(algorithm);
```

What mattered to me here was not only that the token worked, but that it fit the shape of the application well. I did not need server-side sessions, and I did not need every request to hit the database just to understand who the caller was.

Instead, each request can carry its own **proof of identity** through the `Authorization` header, and the server can decide from that token who the user is and what roles they have.

For me, the useful part was thinking of the token as a **small security package**:

- the header describes the token type and signing algorithm
- the payload contains claims such as subject, `userId`, and roles
- the signature is what makes the token verifiable and tamper-resistant

I did not build refresh tokens in this version of *eru*, but I did add token revocation on logout. That was enough to make the flow feel much more like **real application security** instead of just a classroom example.

## Two Different Security Questions

One of the biggest things that helped me this week was to stop thinking about “security” as one single operation.

What I really had in front of me were **two different questions**:

- first: is this request actually coming from a valid logged-in user?
- second: even if it is, should that user be allowed to do this specific thing?

That sounds obvious when written out, but it made a huge difference in the code. Once I separated those two concerns mentally, the implementation also became easier to structure.

The first step is simply about **trust**. Can I trust the token enough to treat this request as authenticated? If yes, I turn that into an internal user object:

```java
AuthenticatedUserDTO authenticatedUser = validateAndGetUserFromToken(ctx);
ctx.attribute(CTX_USER_KEY, authenticatedUser);
```

That way, the rest of the request no longer has to care about the raw token string.

The second step is about **permission**. At that point, the application already knows:

- who the user is
- which roles that user has
- which roles are allowed for the route

So the question shifts from “is this token valid?” to “does this user belong here?”

I liked this split because it made the flow feel much more natural:

1. establish identity
2. compare identity against route permissions
3. only then allow the controller to run

It also made the code **much easier to reason about**, because I no longer had to mix token verification and permission decisions into the same mental bucket.

## Where Security Happens Before a Route Runs

Another thing I liked in this phase was that the security logic could live **before the business logic**, instead of being repeated inside every controller.

In `ApplicationConfig`, I use Javalin’s access-manager flow so the request passes through authentication and authorization before the actual handler runs:

```java
LegacyAccessManagerKt.legacyAccessManager(app, (handler, ctx, routeRoles) -> {
    Set<String> allowedRoles = routeRoles.stream()
            .map(role -> role.toString().toUpperCase())
            .collect(Collectors.toSet());
    ctx.attribute("allowed_roles", allowedRoles);
    authController.authenticate(ctx);
    authController.authorize(ctx);
    handler.handle(ctx);
});
```

What I like about that is that it puts the security rules at the **edge of the request flow**.

In practice, that means:

- routes declare which roles are allowed
- authentication validates the token
- authorization checks the user against the allowed roles
- only then does the actual controller logic run

So by the time a controller gets the request, the security decision has already been made. That keeps the controller focused on the job it is actually supposed to do.

## Letting the Routes Declare Access Intent

One design choice I ended up appreciating a lot was making the access rules visible directly in the route definitions:

```java
routes.post("/auth/register", authController::register, AppRole.ANYONE);
routes.post("/auth/login", authController::login, AppRole.ANYONE);
routes.get("/auth/me", authController::me, AppRole.USER);
routes.post("/auth/logout", authController::logout, AppRole.USER);
routes.post("/auth/roles", authController::addRole, AppRole.ADMIN);
```

That made the system much easier to scan. I did not have to open a controller and then dig through service code just to understand whether an endpoint was public, authenticated, or admin-only.

The same pattern also made the rest of the API feel more coherent:

- public users can browse content
- authenticated users can use personal endpoints and interactions
- admins can create, update, and delete content

That was important to me because it made the backend easier to defend. It is one thing to build endpoints. It is another thing to explain why the access model makes sense.

I also think it made the role model easier to read. The route itself communicates the access intent, which feels much cleaner than hiding those decisions deeper in the stack.

## Reusing the Verified User Throughout the Request

Another small thing that turned out to matter a lot was storing the authenticated user on the request context once the token had already been verified.

That made endpoints such as `/auth/me` and `/interactions/me` much cleaner, because they could work with an already verified internal user instead of reopening the token logic every time:

```java
AuthenticatedUserDTO authenticatedUser = getAuthenticatedUser(ctx);
ctx.status(200).json(CurrentUserDTO.fromAuthenticatedUser(authenticatedUser));
```

That may look like a small thing, but I think it was one of the cleaner decisions in the whole security phase. The token gets interpreted once near the security layer, and from there the rest of the request can work with a much simpler internal representation.

## Handling Credentials Without Storing Plain Text Passwords

Another security-related part that became much more meaningful during this phase was password handling.

In *eru*, passwords are not stored in plain text. They are hashed with BCrypt when the user is created:

```java
this.passwordHash = BCrypt.hashpw(password, BCrypt.gensalt());
```

and later verified like this:

```java
return pw != null && passwordHash != null && BCrypt.checkpw(pw, passwordHash);
```

This was important because it made the reasoning around authentication **much clearer**. The system should never need to know the **original password** after registration. It only needs to store a **secure hash** and compare future login attempts against that hash.

This also helps defend against some of the obvious password-related problems. If the database were exposed, stored password hashes are far safer than plain text values, and BCrypt's salt generation makes simple rainbow-table attacks much less effective.

I did not implement password reset, password change, or brute-force protection in this version, so those are still unfinished areas. But using BCrypt was still an important step toward handling credentials in a more realistic and secure way.

## Final Thoughts on the Seventh Week

The main lesson here was that **good security design** is not only about picking JWT or BCrypt. It is also about **where those concerns live in the architecture**. The cleaner that integration is, the easier the system is to understand, test, and extend later.

<div class="exam-portfolio-pagination">
  <a role="button" href="../rest-and-test/">Previous Chapter</a>
  <a role="button" href="../deployment/">Next Chapter</a>
</div>
