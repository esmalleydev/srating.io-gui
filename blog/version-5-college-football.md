---
title: 'v5.0 - Features'
excerpt: 'Version 5 new features'
coverImage: null
date: '2025-07-24T12:00:00.322Z'
author:
  name: 'Evan S'
  picture: '/public/static/images/evan.png'
ogImage:
  url: null
---


# New Features
- College football data back to 2000-2001 season
- CFB prediction algorithm trained on 20,000 games
- Ranking delta, view the ranking change compared to 1 day and 7 days ago
- Ranking page / graphs custom column picker is easier to use
- Player page now has trends data (college basketball only)


## v5.0
As far as the technical side...lots of architectural changes, mainly detaching logic away from nextjs, mui, etc! This is to reduce dependence on third party code, so it can potentially be removed or swapped more easily in the future.

All page logic has been moved into "Surface" classes, which will handle the decoration. All MUI code is being slowly replaced with internal components, which are faster and easier to use (for me!).

All themes, css styles and processing is beginning to be replaced by internal functions. I thought it would be an interesting project to parse and merge css objects in javascript and output them into a css file. So instead of inlining all the styles on every html element and duplicating a bunch of styling, it hashes a css class to append instead.

- New Surface classes to decorate pages
- New UX components to replace MUI (Papers, Typography, Chips, etc)
- New Theme class util
- New Style class util
- Tons of bug fixes + performance changes

[**Full Changelog**](https://github.com/esmalleydev/srating.io-gui/compare/v4.1...v5.0)

Looking ahead towards the future... more performance fixes and internal components, make this blog GUI better, and maybe NBA / NFL data ?

