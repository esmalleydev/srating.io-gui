---
title: 'ELO calc'
excerpt: 'How to calculate ELO'
coverImage: null
date: '2023-06-10T12:00:00.322Z'
author:
  name: 'Evan S'
  picture: '/public/static/images/evan.png'
ogImage:
  url: null
---

# srating.io ELO calculation

## Introduction
In the world of competitive sports, ranking systems play a vital role in determining the relative strength and skill of teams and individuals. One widely used rating system is the Elo rating system, which was originally developed for chess but has found application in various sports, including college basketball. In this blog post, I will discuss how srating.io calculate ELO.

## Understanding the Elo Rating System
The Elo rating system is a method for calculating the relative skill levels of players or teams in head-to-head competitions. It assigns each player or team an Elo rating, which represents their estimated strength. The system takes into account the outcome of each match and updates the ratings accordingly. The Elo rating system assumes that the outcome of a match is influenced by the difference in ratings between the competitors.

## Code example


```javascript
const r1 = Math.pow(10, (team_1_current_elo / 400));
const r2 = Math.pow(10, (team_2_current_elo / 400));

const e1 = r1 / (r1 + r2);
const e2 = r2 / (r1 + r2);

const s1 = away_score > home_score ? 1 : 0;
const s2 = home_score > away_score ? 1 : 0;

const k = 32;

let team_1_new_elo = team_1_current_elo + (k * (s1 - e1));
let team_2_new_elo = team_2_current_elo + (k * (s2 - e2));
```

## Breaking Down the Formula:

1. Step 1: Convert the Elo ratings into exponentiated values using the base 10 logarithm. This conversion is done to scale the ratings appropriately for further calculations.
2. Step 2: Calculate the expected scores (`e1` and `e2`) for both teams using the exponentiated ratings.
3. Step 3: Determine the actual scores (`s1` and `s2`) based on the outcome of the game. If the away team's score is higher, `s1` is 1 or if the home team's score is higher, `s2` is 1. Otherwise,  `s1` or `s2` are 0.
4. Step 4: Set the k-factor, which represents the weight or sensitivity of each match's impact on the Elo ratings. In this case, the value of k is set to 32.
5. Step 5: Update the Elo ratings for both teams using the formula: `new_elo = old_elo + (k * (actual_score - expected_score))`. The difference between the actual and expected scores determines the change in ratings for each team.

## Conclusion

The Elo rating system provides a systematic approach to assess the relative strength of teams or players in college basketball. Keep in mind that the Elo rating system is dynamic and evolves as teams compete, allowing for continuous adjustments to reflect their current performance.


