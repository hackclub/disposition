# Disposition
Disposition is a YSWS platform for an upcoming event (called disposition xd)!!
You ship projects and we ship physical media (cds, vinyls and cassetes).

I think the edgier aesthetic of this website is pretty cool if you ask me :)

Also, even though i can't say that anyone would WANT to self host it, here are some instructions:

## Setup

1. install dependencies
```bash
pnpm install
```
2. [setup MariaDB](https://wiki.archlinux.org/title/MariaDB) + open `schema.mwb` with [MySQL Workbench](https://www.mysql.com/products/workbench/) and forward engineer the schema to your database.
3. edit the .env file according to ``.env.example``
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

Anyways, ive just always wanted to see a bit more of an unconventional website for a ysws so this is my go at that.