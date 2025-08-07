---
title: 'Elo calc'
excerpt: 'How to calculate Elo'
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
Here is a short summary of how I do my Elo calculation. Elo is a metric to rank teams competitively, originally for chess.

## Understanding the Elo Rating System
The Elo rating system is a method for calculating the relative skill levels of players or teams in head-to-head competitions. It assigns each player or team an Elo rating, which represents their estimated strength. The system takes into account the outcome of each match and updates the ratings accordingly. The Elo rating system assumes that the outcome of a match is influenced by the difference in ratings between the competitors.

## JS Code example

```javascript
r1 = Math.pow(10, (elo_1 / 400));
r2 = Math.pow(10, (elo_2 / 400));

e1 = r1 / (r1 + r2);
e2 = r2 / (r1 + r2);

s1 = away_score > home_score ? 1 : 0;
s2 = home_score > away_score ? 1 : 0;

k = 32;

new_elo_1 = elo_1 + (k * (s1 - e1));
new_elo_2 = elo_2 + (k * (s2 - e2));
```

## Breaking Down the Formula:

1. Convert the Elo ratings into exponentiated values using the base 10 logarithm. This conversion is done to scale the ratings appropriately for further calculations.
2. Calculate the expected scores (`e1` and `e2`) for both teams using the exponentiated ratings.
3. Determine the actual scores (`s1` and `s2`) based on the outcome of the game. If the away team's score is higher, `s1` is 1 or if the home team's score is higher, `s2` is 1. Otherwise,  `s1` or `s2` are 0.
4. Set the k-factor, which represents the weight or sensitivity of each match's impact on the Elo ratings. In this case, the value of k is set to 32.
5. Update the Elo ratings for both teams using the formula: `new_elo = old_elo + (k * (actual_score - expected_score))`. The difference between the actual and expected scores determines the change in ratings for each team.

## Conclusion

The Elo rating system provides a systematic approach to assess the relative strength of teams or players in college basketball. Keep in mind that the Elo rating system is dynamic and evolves as teams compete, allowing for continuous adjustments to reflect their current performance.


