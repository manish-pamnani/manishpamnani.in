---
title: "useRef vs useState: The Ultimate React Hooks Showdown"
slug: "useref-vs-usestate"
date: 2026-07-14
description: "A no-BS comparison of useRef and useState — what each hook is for, their real-world trade-offs, and dead-simple rules for picking the right one."
tags:
  - React
  - Hooks
  - useRef
  - useState
---

By definition, [`useRef`](https://react.dev/reference/react/useRef) is a built-in feature that provides a way to store a mutable value that persists across component re-renders without triggering a re-render. Now imagine a situation where you're tracking the previous values of a counter in real-time, and you want it fast and you want it to happen smoothly without your UI flickering on every update.

Enter our mutant superhero: `useRef`, whose mutable persistence for DOM refs, timers, or "shadow state" is perfectly made for situations like these.

[`useState`](https://react.dev/reference/react/useState) is the exact opposite, React's inbuilt reactive rockstar, that craves attention with every update, forcing a full re-render without actually thinking why to. Perfect for visible changes like button toggles or form values.

While it is perfect for certain situations, using it in any other situation that requires frequent updating or extensive calculations can cause multiple re-renders, which ultimately can bog down your app and result in chaos and confusion.

In this post, we will discuss what `useRef` and `useState` are, compare their strengths head-to-head in a clear showdown, and arm you with dead-simple rules for where to use each without making you feel dumb.

Think of it as your no-BS React hook cheat sheet for:

- Mastering the UI update machine, `useState`
- Getting your head around `useRef` (the silent DOM whisperer)
- The ultimate battle between `useRef` and `useState`, plus live code demos
- Which hooks can be used in which situation
- Mistakes beginners make while using them and how to avoid them
- Pro patterns that make you sound smart

## useState: The Drama Queen Who Steals Every Spotlight

`useState` is React's built-in hook that craves attention with every update, forcing a re-render without actually thinking about whether it's required or not. A state generally refers to a piece of data or a certain set of properties that needs to be tracked in an application. For example, if you want to track the number of times a button is clicked, a state variable will help you do that.

Here's an example for the same:

```jsx
import { useState } from 'react';

function Counter() {
  // Declare a state variable 'count' and a function 'setCount' to update it
  const [count, setCount] = useState(0);

  // Function to increase count when the button is clicked
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h2>Clicked: {count} times</h2>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
}
```

If you notice, every time the button is clicked, the state value changes, and it is not displayed immediately since React has to re-render the entire component first to show the updated value.

That's one of the biggest benefits (and disadvantages) of using state. While it does ensure you don't miss any changes (be it a state change or a UI change) and automatically reflects the latest data, unnecessary updates can hurt your app's performance.

In short, `useState` is perfect for data that's visible to a user in the frontend, like form values, toggles, user inputs, or counters (as we saw above).

While you may think of using `useState` for updating every other state in your React app, all is not that easy. You still need to know the major disadvantages of `useState` before you start using it:

- **Every state update causes a re-render.** Whenever you call the state updater (or the setter function), React will re-render the entire component, even without checking whether you actually need one. This re-render is workable for small components, but in complex ones it can cause havoc if not handled correctly.
- **Asynchronous state updates can be confusing.** `useState` updates are asynchronous, meaning React batches multiple updates together. This sometimes causes confusion, especially when you need to debug why the state isn't updated instantly after calling the setter.
- **Multiple states can get messy quickly.** If you're managing several separate values with `useState`, your component can turn into a messy and chaotic one.

  ```jsx
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  ```

  This is somewhat workable for small forms, but once your component structure grows, tracking all these updates and handlers becomes a nightmare.

- **State resets on unmount.** When a component unmounts, all the state inside its `useState` calls resets, meaning you can't hold onto data forever when you navigate to a different component. If you want the data to persist even after unmounting, you'll need to lift it up to a parent component, store it outside React (like `localStorage`), or use an external state management library like [Redux](/blogs/zustand-vs-redux-2026/).

  Although using a library won't harm you, it will ultimately increase your coding time to implement a simple, thorough change.

## useRef: The Silent Ninja That Works Behind the Scenes

Now it's time for our next champion, `useRef`, the complete opposite of `useState`. While `useState` unnecessarily renders everything, `useRef` handles everything subtly and quietly.

`useRef` is a React hook that creates a mutable object with a `.current` property. The `.current` property helps you store any value — numbers, strings, DOM elements, objects, functions, you name it, `useRef` has got it. That's not it, you can also change `.current` anytime, and it won't unnecessarily re-render your component. A quick example to sum up how it works:

```jsx
import { useRef } from 'react';

function SimpleRef() {
  const myRef = useRef(0);

  const updateRef = () => {
    myRef.current = myRef.current + 1; // Change it!
    console.log('Ref value:', myRef.current);
  };

  return (
    <div>
      <button onClick={updateRef}>
        Update Ref (No re-render!)
      </button>
      <p>Component stays calm</p>
    </div>
  );
}
```

Now, before you go ahead and use `useRef` for everything, here are some real examples of what you can store in `useRef` without going crazy:

| Use Case | What to Store | Why useRef? |
| --- | --- | --- |
| DOM Elements | `<input ref={myRef}>` | `myRef.current.focus()` |
| Previous Values | `prevCountRef.current = count` | Track changes silently |
| Timers | `intervalRef.current = setInterval(...)` | Clean up without re-renders |
| Canvas Context | `canvasRef.current.getContext('2d')` | Heavy drawing operations |
| Flags | `isInitializedRef.current = true` | Internal component state |

While it may seem like `useRef` can be a perfect solution every time you encounter one of these use cases, that's not the case. Similar to `useState`, `useRef` also has its own set of disadvantages, which you should keep in mind before implementing it.

- **Not reactive.** Unlike `useState`, changing `myRef.current` won't trigger a re-render. This, however, is usually an advantage, but it becomes a disadvantage when you want the data updated instantly in your application — think updating a count variable or showing filtered data without a refresh. The data stays stale in most cases, since no re-render happens on changing `.current`.

  A simple fix in this kind of situation is to use the rival `useState` for any data that requires instant updates.

- **Manual cleanup required (memory leaks).** `useRef` doesn't know when to clean up timers, event listeners, or subscriptions stored in `.current`. This can create significant memory leaks if you use it blindly without thinking about whether it's needed. `useRef` isn't magical; it won't stop timers or remove event listeners automatically when your component unmounts, unlike `useState`, which React tracks and cleans up as part of the component lifecycle.

  To avoid this, always remember to clean up refs inside a `useEffect` cleanup function.

- **Can't use in dependencies.** Since refs don't trigger re-renders, functions using `ref.current` can hold stale values if not handled carefully. This happens because JavaScript closures capture the value of `ref.current` at the time the function is created, not when it's called. Even though `ref.current` can change later during code execution, the closure won't "know" about it until you access it dynamically.

  A simple fix here is to always read `ref.current` inside the event handler, and never store it in state or closures.

## Master useRef vs useState Like a React Pro

And there you have it, the ultimate `useRef` vs `useState` showdown!

The simple truth:

- **useState:** Use it when you want to reflect updates instantly — showing a counter value, updating from inputs as the user types, toggling UI elements (like modals, menu dropdowns, or switching between dark and light mode), or rendering filtered/sorted lists based on user actions.
- **useRef:** Use it when you want to store or access values without triggering a re-render — focusing or scrolling to a DOM element, managing timers or intervals (start/stop/reset), keeping track of previous state or prop values, or holding mutable flags and instance-like variables that your event handlers need but your UI doesn't directly display.

A 10-second rule: if you can decide something in under ten seconds using a simple mental check, decide and move on instead of overthinking it. For `useState` vs `useRef`, the rule looks like this:

1. Does this value need to show up in the JSX or change the UI? Yes, then pick `useState` and move on.
2. Does this value need to be stored or accessed in the background (like a DOM node, timer ID, previous value, or a simple flag) without triggering a re-render? Then pick `useRef` and move on.

Neither hook is "better" — each has its pros and cons. Using them according to your use case is a better choice than picking one blindly. Use `useState` for reactivity, `useRef` for efficiency, and combine them for React mastery. Using them together will ultimately result in a smoother, more efficient app.

If you liked this post, you might also enjoy [Zustand vs Redux: Which React State Manager Wins in 2026](/blogs/zustand-vs-redux-2026/).
