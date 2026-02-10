# ChadXNG
![banner](simple-custom-fork/img/searxng.png)
A custom SearXNG config that:

- Runs in docker
- Supports HTTPS
- BANS GENERATIVE AI DOMAINS!!!!  If you don't like it don't use this. If you want AI SLOP then fork this
- Uses privacy-friendly frontends if it's feasible and mostly usable
- Uses ProtonVPN free tier as a network proxy

# Notes people may wanna know:

### Link replacing:

| site | replaced by |
| --- | --- |
| Reddit | redlib.catsarch.com |
| Twitter | nitter.net |
| Genius | intellectual.catsarch.com |

# Domains:

### blacklists:
- Deepwiki 
- Grokipedia
- All `.ai` domains (sorry Anguilla)
- nixos.wiki (official wiki.nixos.org exists)
- elderscrolls.fandom.com (UESP better and fuck fandom)
- fallout.fandom.com (fallout.wiki better and fuck fandom)
- minecraft.fandom.com (minecraft.wiki better and fuck fandom)

### high priority:

- Wikipedia

For more info on how stuff is handled, just check out the settings.yml file 


# How to Setup:

- copy .env.example file to .env
- change SEARXNG_SECRET, original README suggested using the string generated from the `openssl rand -hex 32` command
- [Get your ProtonVPN WireGuard key](https://protonvpn.com/support/wireguard-configurations) and change
  WIREGUARD_PRIVATE_KEY
- run the docker compose

HTTP runs on 8080 and HTTPS run on 8888

Example [Firefox policy](https://mozilla.github.io/policy-templates/#policiesjson-96):

```json
{
    "Alias": "@sx",
    "Name": "ChadXNG",
    "URLTemplate": "https://localhost:8888/search?q={searchTerms}"
}
```

![gallery](Pictures/gallery.png)
