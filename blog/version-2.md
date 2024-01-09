---
title: 'v2.1 - changes'
excerpt: 'Changes in version 2.1, Typescript, nextjs app router, server side rendering'
coverImage: null
date: '2024-01-08T12:00:00.322Z'
author:
  name: 'Evan S'
  picture: '/public/static/images/evan.png'
ogImage:
  url: null
---

# Changes in version 2.1

I wanted to add a universal pin button, to keep track of the same game on the score screen, picks, home page, etc.

## Typescript, nextjs app router, redux!
I decided to use [Redux](https://redux.js.org/usage/nextjs) for state management to share the pins. Redux suggested implementing it using the app router version of nextjs. Since I was currently using the page router, I would need to restructure a lot of code, so I figured I might as well do it in Typescript.

## Issues encountered
Not much to say about TS and redux... I did some video game programming in c# and it being a stict language made me want something similar for JS. I never got around to implementing much in TS but I'm a fan now, so every component will be switched over soon. The state management in reactjs in general is fine, redux seems to improve on it some. So I switched some more global setting over to it.

My main issues were with the app router, it handled the cached data differently than the page router so a lot of things broke. Team / game pages were not updating with the correct data, it essentially cached the entire page for more than a day! But I think my issues were with how I implemented it, which is how I learned more about react server components.

## More server side rendering
To fix the caching router issues, I took a different approach to loading the data. I went with more of a [streaming](https://nextjs.org/docs/app/building-your-application/rendering/server-components#streaming) approach to split the data into small chunks. Each of those chunks would be loaded into a server component and individual api calls could be cached at different intervals. For example, when I redesigned the game details screen, the data is refreshed every x seconds, we want to see the score update without having to refresh the screen. Even though the other components are getting refreshed as well, most are still cached so nothing is changing besides the data which my be invalid.

## Adding conference rankings
I added a third set of rankings, this one totals and averages each [conference](/cbb/ranking?view=conference)!
