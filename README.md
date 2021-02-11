# cf-ddns

Simple script to update a cloudflare zone record with the public facing ip address of requesting machine. This is useful for ddns applications. Retrieving public ip info is done through DNS rather than hitting some http API.

## Installation

1. Clone this repo `git clone https://github.com/alumowa/cf-ddns.git`.
2. Install dependencies: `npm install`.
3. Create `.env` file that contains the following:
  * `CF_APITOKEN=your_cloudflare_api_token`
  * `CF_ZONEID=your_cloudflare_zone_id`
  * `CF_RECORDID=your_cloudflare_record_id`
4. Run: `node index.js`

It's best to run the script periodically using `cron`.

## Auth

The example `.env` file above uses the `CF_APITOKEN` variable but if using the Cloudflare API key is preferred then the `CF_APITOKEN` variable can be replaced with both `CF_APIKEY` and `CF_EMAIL`.

## Dependencies

The only dependency required is [dotenv](https://github.com/motdotla/dotenv) to handle the `.env`
file loading/parsing.