# Disposition
![logo](app/assets/logos/dispositionAlt.png)

Disposition is a YSWS platform for an upcoming event (called disposition xd)!!
You ship projects and we ship physical media (cds, vinyls and cassetes).

I think the edgier aesthetic of this website is pretty cool if you ask me :)

Also, even though i can't say that anyone would WANT to self host it, here are some instructions:

## Setup

1. install dependencies
```bash
pnpm install
```
2. [setup PostgreSQL](https://wiki.archlinux.org/title/PostgreSQL) and create a database for the project
3. edit the .env file according to ``.env.example``, then apply the schema
```bash
pnpm drizzle-kit push
```
4. start dev server
```bash
pnpm run dev
```
5. enjoy!

## Production

1. build
```bash
pnpm build
```
2. preview production build
```bash
pnpm preview
```

## How twas' made
Surprisingly, making a webos in nuxt isnt actually that difficult! It's actually easier! (can you believe it, the framework built to make your life easier while making websites makes your life easier while making websites?)

### design language
it was mostly inspired by older websites from like neocities and stuff. mostly personal websites, like myspace profiles. i genuinely lost the reference material so i cant upload it here but you get the point

### window manager
the window manager was the first thing i worked on! originally, windows stored their own position/size but i changed that later on in the development cycle so that windows could resize themselves (see `app/apps/onboarding/onboarding.vue`)

### notifications/announcements

for context, ui wise: 
 - notifications = white
 - announcements = dark grey 

notifications are a personal thing (you are the only one that recieves it) and announcements are an everyone thing. it was kinda annoying to implement this db schema-wise.

### apps and data fetching

separating between admins, public and private info on every body for every request (especially because this is typescript) results in a lot of boilerplate, but i think i found a nice file structure for it which is mostly the same across server/client code (client has `utils/database.ts and server has `utils/...` where each db type has a file because each db type has three different types of requests oh my god bruh)

nuxt made it a lot more convenient tho. nuxt-auth-utils is like the best plugin ever i love it so much i would straight up marry it highkey. if nuxt-auth-utils didnt exist neither would this project. it makes auth management really easy! so, differentiating between what endpoints with what queries to get clientside was pretty nice.

this is theoretically my first full stack big nuxt project. the difference between `useFetch` and `$fetch` isnt very clear but if you know how to read then you will eventually understand from the docs

### shop, pii and orders and requests and aaaahhh

whole shop thing was atleast 2-3 weeks of work

look, it's a lot of work to implement shop items which are actually albums but actually they can be cds or vinyls or cassettes but oh wait some items arent that

and also the user should be able to request items and have like a message to the fulfillers and stuff and oh my god bro

200 billion edgecases. but i guess its not as bad as the post for ships.

### ships, projects, devlogs and whatnot

since this is my first time ever programming a ysws platform (there's a first time for everything i guess), ships/projects seemed really daunting to me at first because i know that i should store a lot of data to make sure that fraud checks and reviewing are a bit more convenient. turns out, I was wrong!

Halfway through third space, macondo open sourced (shoutout santi and nathan) and they use like basically the same stack so i was able to take a peek at their db schema. apparnetly, you dont actually have to store 1gb of data per project or whatever the hell i was thinking.

so, with the help of my eyes and 20 of my neurons i was able to cook up the schema for these. originally, i wanted my devlogs to work like they do on stardance/flavortown where time only gets added to your project if you create a devlog. However, ari does not support this :) so i had to do what a lot of yswses do now and have devlogs be optional. which i guess is more convenient for the user, but obligatory devlogs make it easier to justify the time spent on a project for reviewers!!

### conclusion

that was a lot of yapping. tl;dr, ive just always wanted to see a bit more of an unconventional website for a ysws so this is my go at that.