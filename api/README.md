# API

To setup the API, cd into this directory and run `npm install`.

Once your dependencies are installed, you can setup your environment variables.

1. Create a `.env` file in this directory
2. Copy the contents of `.env.example` into the `.env` file
3. Replace the placeholders with your own values

Here's an example `.env` file:

```
PORT=3000

API_URL=http://localhost:3000
DASHBOARD_URL=http://localhost:3001

JWT_SECRET=a_RaNdoM_sEcReT

MONGODB_URI=mongodb://localhost:27017/welcomer-bot
REDIS_URI=redis://localhost:6379

DISCORD_CLIENT_ID=1234567890987654321
DISCORD_CLIENT_SECRET=m7u79832y4kljhsdf
DISCORD_BOT_TOKEN=MTIzdfjhdsfkljsldkfj.orh234kmhsf.sod87fnoijwne4kl-pwo7ebrkljsbhdfhkjbsdkf
```
