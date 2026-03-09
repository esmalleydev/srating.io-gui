---
title: 'New Metrics: Effective Height & Elite Length'
excerpt: "How we're using exponential scaling and standard deviation to categorize every team identity in the league."
coverImage: null
date: '2026-03-09T12:00:00.322Z'
author:
  name: 'Evan S'
  picture: '/public/static/images/evan.png'
ogImage:
  url: null
---

# Height scores: Measuring Roster Construction on srating.io

To get a better look at how teams are built, I’ve added three new metrics to the platform. Here’s the breakdown of how they work and why I’m using them.

---

## 1. Weighted Average Height
**What it is:** Instead of just averaging the roster, this weights height by minutes played.
**The Logic:** If a 7-footer never leaves the bench, he doesn't actually make the team taller on the court. 
**Formula:** `sum(inches * minutes) / total_minutes`

This gives us the "effective height" of a team during active play. It filters out the noise of deep-bench players who don't impact the game.

---

## 2. Elite Length (Z-Score)
**What it is:** A measure of how "top-heavy" a team is with true giants.
**The Logic:** In basketball, the difference between 6'10" and 7'0" is more impactful for rim protection than the difference between 6'0" and 6'2". To account for this, I square the height values to reward those extra inches exponentially.
**The Format:** To make the massive raw numbers readable, I convert them into a **Z-Score**. 
* A **0.0** means your top-end length is league average. 
* Anything over **+1.5** means you have freakish, outlier size.

---

## 3. Height Consistency
**What it is:** The standard deviation of height across the rotation.
**The Logic:** This measures "roster shape."
* **Low Standard Deviation:** A "flat" roster. Everyone is roughly the same height (e.g., a lineup of 6'7" wings). This usually indicates a modern, switchable defense.
* **High Standard Deviation:** A "polarized" roster. You have very tall centers and very short guards. This is the traditional "big man/small guard" setup.

---

## The Four Team Identities
Using these three data points, we can categorize team builds into:

1. **The Great Wall:** High weighted average, high elite score, and high consistency. They are tall across the board.
2. **Wing Wall:** Medium weighted average, low elite score, high consistency. No giants, but no small players either.
3. **Polarized:** High elite score but low consistency. Classic "Big/Small" roster construction.
4. **Small-Ball:** Low weighted average and low elite score. Built for speed over size.