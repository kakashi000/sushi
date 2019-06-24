# Sushi
Sushi is an anime-themed general-purpose Discord bot that uses the Eris library and its built-in command framework.

## Installation
1. Install dependencies

This is `npm install` or `yarn`.

2. Create config

Create a file named `config.json` inside the `config` subdirectory. The file should look like this:

```json
{
  "botToken": "token",
  "botOwnerIDs": ["your_id"],
  "color": 14243671,
  "translateKey": "key",
  "imgID": "id",
  "imgKey": "key"
}
```
where:

the aptly named `botToken` is your bot's token,

`botOwnerIDs` is an array of user IDs (preferrably yours); some commands can only be used by these users,

`color` is a decimal color value for use in Discord's embeds,

`translateKey` is an API key from Yandex.Translate,

`imgID` is a search engine ID from Google,

and `imgKey` is a matching API key.

