---
title: 'ELO Revised'
excerpt: 'How srating.io calculates ELO (revised)'
coverImage: null
date: '2023-10-23T12:00:00.322Z'
author:
  name: 'Evan S'
  picture: '/public/static/images/evan.png'
ogImage:
  url: null
---

# srating.io ELO revised calculation

## Introduction
In my first ELO post, I used chatGPT to generate a quick blog. I've decided it adds too much fluff or I'm not a great "prompt engineer".

## Changes
Orginally, every season, each team would start at 1500 rating. I have changed that to attempt to carry over a few points based on returning players + their efficiency.

Now for the beginning of the season, I will take the returning players and add their

```MPG (minutes per game) * their PER (player efficiency rating) + (ORT (offensive rating) - DRT (defensive rating)) * a modifier```

to reduce or increase their elo from the following season.

## Example
In 2015, Kentucky finished 38-1 with an elo of 1906, one of the highest in recent seasons.

In 2016, their elo was reduced to 1576... pretty much all of their stacked roster left.

