---
title: "02 - React, Set, Go!"
description: "The second phase of the eru frontend process."
date: 2026-05-01
weight: 2
showWordCount: true
showReadingTime: true
---

<div class="exam-portfolio-nav">
  <a class="exam-portfolio-nav__link" href="../">Overview</a>
  <a class="exam-portfolio-nav__link" href="../square-one/">01</a>
  <a class="exam-portfolio-nav__link exam-portfolio-nav__link--current" href="../react-set-go/">02</a>
  <a class="exam-portfolio-nav__link" href="../route-awakening/">03</a>
</div>

## Overview

"Excuse me?"

That was my initial reaction when someone explained SPAs (Single Page Applications) to me for the first time.

So instead of constantly reloading entirely new pages the old-school way, React simply updates the parts of the UI that actually changed without triggering a full page reload. Components appear, disappear, update, re-render, and react to state changes constantly, while React quietly handles what actually needs to change in the DOM behind the scenes.

Honestly, the closest comparison I can think of is Kamaji from *Spirited Away* *(if you know you know)*, constantly pulling levers and sending things around behind the scenes while the bathhouse somehow continues functioning without collapsing into complete chaos.

That was roughly how React started feeling to me.

The idea that you could build an entire application around a single `index.html` file *(this is heavily simplified for dramatic effect)* completely blew my mind at first, and I could immediately see the real value of SPAs: reduced loading times and a much smoother user experience.

## AuthPage

The AuthPage is the first page of the application, and the first thing a user sees before gaining access to a new world of interesting knowledge.

So what does an AuthPage need?

- A login form
- A register form

And that's about it. Seems easy, right?

Wrong.

If we break it down, this is how it's going to work:

- the user writes something in a form
- React stores the input in state
- the form is submitted
- the frontend calls the backend
- the backend returns a JWT token
- the token is saved
- the user is redirected into the app

That is a lot more connected than a normal static component.

The route-level component became `AuthPage.jsx`. It decides whether the user is logging in or signing up based on the route:

```jsx
function getMode(routeMode) {
  return routeMode === "login" || routeMode === "register"
    ? routeMode
    : null;
}
```

That means `/auth/login` and `/auth/register` can use the same page, but show different form content.

Because login and register are part of the same area of the application, they share the same layout, the same branding, and the same general purpose.

At the same time, I did not want `AuthPage` to contain every input field and validation rule itself. So the page delegates the actual form work to smaller components:

```jsx
<AuthPanel
  mode={authMode}
  onModeChange={changeMode}
  onLogin={submitLogin}
  onRegister={submitRegister}
  setError={setError}
  setMessage={setMessage}
/>
```

`AuthPage` controls the page and navigation. `AuthPanel` controls which form is shown. `LoginForm` and `RegisterForm` handle their own input state.

## Controlled Forms

The login form uses controlled inputs. That means React state is the source of truth for what is written in the form.

```jsx
const [loginForm, setLoginForm] = useState({
  username: "",
  password: "",
});
```

When the user types, the input updates state:

```jsx
function updateLoginField(event) {
  const { name, value } = event.target;
  setLoginForm((form) => ({ ...form, [name]: value }));
}
```

I like this pattern because the same handler can update both username and password. The `name` attribute on the input decides which field should change.

```jsx
<input
  name="username"
  value={loginForm.username}
  onChange={updateLoginField}
  placeholder="Username"
  required
/>
```

This is one of those React patterns that looked a little strange at first, but later became very useful. Instead of reading values manually from the DOM when the form submits, React already knows what the current form state is.

The submit handler then prevents the browser's default form reload and calls the login function from the parent:

```jsx
async function submitLogin(event) {
  event.preventDefault();
  setSubmitting(true);

  try {
    await onLogin(loginForm);
    setLoginForm(emptyLoginForm);
  } catch (apiError) {
    setError(apiError.message);
    setMessage("");
  } finally {
    setSubmitting(false);
  }
}
```

The `event.preventDefault()` part is important in a SPA. If the browser did a normal form submit, it would reload the page, which is exactly what React Router is trying to avoid.

## What Went Well

The part that worked well was splitting the auth flow into smaller responsibilities.

`AuthPage` does not need to know every input field. `LoginForm` does not need to know how routing works. The backend call is handled through functions passed down from `App.jsx` and `eruApi.js`.

The flow is roughly:

```text
LoginForm
  -> onLogin(loginForm)
  -> AuthPage submitLogin
  -> App handleLogin
  -> eruApi.login
  -> localStorage token
  -> navigate("/feed")
```

Another thing that worked surprisingly well was using a `submitting` state. It prevents the user from repeatedly clicking the submit button while the request is still running:

```jsx
<button type="submit" disabled={submitting}>
  Login
</button>
```

It is a small detail, but it matters more than I initially expected.

Without it, users could accidentally send multiple login or register requests at the same time and duplicate their requests *(don't ask how I know)*.

## Thoughts About Auth in a SPA

Authentication in a SPA has a specific challenge: the frontend state disappears when the page refreshes.

So after login, it is not enough to only set `currentUser` in React state. The app also stores the JWT token in `localStorage`, so the session can survive a refresh.

The simplified flow looks something like this:

```js
localStorage.setItem("eruToken", token);
```

Then, when the app loads again, it checks the token and calls `/auth/me` to restore the current user.

This is important because React state only lives while the app is running. `localStorage` lives beyond the current render, so it can be used to restore the session.

At the same time, I had to remember that decoding or storing a token in the frontend is not the same as securing the application. The backend still has to verify the JWT and check roles. The frontend just uses the token so it can send authenticated requests and show the correct UI.

## Final Thoughts on the Second Frontend Week

The biggest lesson was probably that React is not really about writing less code. It is about organizing complexity. At first, components, props, state, and callbacks felt like extra work. Later, when the application started growing, I realised they were the reason the frontend remained manageable at all.

The authentication flow was also my first real example of how tightly connected a modern frontend can be. A login form is no longer just a form. It interacts with state, routing, API calls, localStorage, loading states, validation, and backend authentication, all at the same time.

At the end of the day, we should probably all be thankful for Kamaji.

Because somewhere behind the scenes, while users casually click buttons and move through the application, React is constantly pulling levers, updating components, managing state changes, re-rendering the UI, and somehow keeping the entire frontend from collapsing into complete chaos.

<div class="exam-portfolio-pagination">
  <a role="button" href="../square-one/">Previous Chapter</a>
  <a role="button" href="../">Back To Overview</a>
  <a role="button" href="../route-awakening/">Next Chapter</a>
</div>
