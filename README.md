# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)
- [Follow the Tutorial](https://remix.run/docs/en/v1/tutorials/jokes)

## Development

I have lots of outstanding questions about React, Remix and Typescript

Streams [Playlist](https://www.youtube.com/playlist?list=PLH9DOcwEO0EFOzPZmUFIzoAxaBmzGOzEr)

## Deployment

I have chosen fly.io as a host. Access from the CLI

[details in tutorial](https://remix.run/docs/en/v1/tutorials/jokes#deployment)

```
// install flyctl, fly
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

// fly project setup
fly launch //in project root
fly secrets set SESSION_SECRET=your-secret-here

// prisma prep for deploy
npx prisma migrate dev
npx prisma db seed

// deploy
fly deploy
```

### Problems

the prisma db is not connected properly

[Hosted App](https://remix-jokes-natalie.fly.dev/)

[Monitoring](https://fly.io/apps/remix-jokes-natalie/monitoring)

[Secrets](https://fly.io/apps/remix-jokes-natalie/secrets)

> I added DATABASE_URL through the CLI, and while the project does build, the db is clearly either in the wrong place or is empty
