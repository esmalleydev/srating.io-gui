---
title: 'Conf. realignment'
excerpt: 'Schema design to handle team changing conference, player transfers'
coverImage: null
date: '2023-08-06T12:00:00.322Z'
author:
  name: 'Evan S'
  picture: '/public/static/images/evan.png'
ogImage:
  url: null
---

# Handling conference realignment, player transfers

## Farewell Pac-12
As the 2025-2026 college basketball season approaches, the landscape is undergoing a significant transformation. Established teams like UCLA and USC are saying goodbye to their old home, the Pac-12, and moving to the Big 10. This move isn't isolated, as Oregon and Washington are also making the switch to the Big 10. At the same time, the Big 12 is welcoming new members - Arizona, ASU, and Utah.  As fans bid farewell to the famed "conference of champions," some might even hope for the charismatic Bill Walton to find his way to the Big 10 broadcasting booth.

## Adapting the Database Schema
In the realm of ever-changing college basketball dynamics, where conference affiliations shift and players change teams, the challenge lies in managing this complexity within a database. Here's how srating.io handles the intricacies of conference realignment and player transfers:

```
player <- player_team_season -> team
team <- team_season_conference -> conference
```

## Behind the Scenes: The Schema Setup
Rather than binding teams and players to fixed conferences, srating.io adopts a flexible strategy. The framework is supported by two core tables: team_season_conference and player_team_season.

## Players Take Center Stage
A `player` entry encapsulates vital player details, encompassing attributes such as name, position, and more, offering a comprehensive overview of each athlete.

## Teams in the Spotlight
Equally vital, a `team` record encapsulates the essence of each team, encompassing elements ranging from their name and colors to captivating imagery.

## Tracking Players' Journeys: `player_team_season` Table
To navigate the intricate paths of players across seasons and teams, the `player_team_season` table comes into play. This table establishes connections between players, teams, and seasons, allowing a seamless way to trace a player's historical affiliations.

## The Ebb and Flow of Conferences: Enter `team_season_conference`
The `team_season_conference` table is the linchpin that enables srating.io to handle the fluid nature of conference affiliations. By linking teams with specific seasons and their respective conferences, this table provides a detailed snapshot of the evolving conference landscape.

As the college basketball landscape continues to transform due to conference changes and player movements, srating.io's database schema stands as a practical solution. By freeing teams and players from static conference ties and instead fostering adaptable relationships, it adeptly manages the intricate dance of conference realignment and player transfers.




