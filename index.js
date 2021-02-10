#!/usr/bin/env node

'use strict';

const { Resolver } = require('dns').promises;
const Https = require('https');
const Path = require('path');

//Load ENV
require('dotenv').config();

/**
 * Utilize DNS to find public facing ip. Lightweight
 * and does not rely on an HTTP based api.
 *
 * It's *possible* that the nameserver ip addresses
 * change in the future...
 *
 * Note: Can also use myip.opendns.com with resolver[1-4].opendns.com
 */
const Service = {
  hostname: 'o-o.myaddr.l.google.com',
  nameservers: [
    '216.239.32.10', //ns1.google.com
    '216.239.34.10', //ns2.google.com
    '216.239.36.10', //ns3.google.com
    '216.239.38.10', //ns4.google.com
  ]
};

(async function() {

  const resolver = new Resolver();
  resolver.setServers(Service.nameservers);

  //GOOG's service uses the TXT record
  const [[ pubIpV4 ]] = await resolver.resolveTxt(Service.hostname);


  /**
   * Update Cloudflare DNS record (PATCH) using
   * the ip from above.
   */

  //Request payload
  const payload = JSON.stringify({ content: pubIpV4 });

  const options = {
    hostname: 'api.cloudflare.com',
    path: Path.join('/client/v4/zones/', process.env.CF_ZONEID, '/dns_records/', process.env.CF_RECORDID).normalize(),
    method: 'PATCH',
    headers: {
      'X-Auth-Key': process.env.CF_APIKEY,
      'X-Auth-Email': process.env.CF_EMAIL,
      'Content-Type': 'application/JSON',
      'Content-Length': payload.length
    }
  };

  const req = Https.request(options, (res) => {

    const { statusCode, headers } = res;

    if(statusCode !== 200){
      console.error(`STATUS: ${statusCode}`);
      console.error(`HEADERS: ${JSON.stringify(headers)}`);

      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.error(`BODY: ${chunk}`);
      });
    }else{
      console.info(`CF record ${process.env.CF_RECORDID} updated to ${pubIpV4}`);
    }

  });

  req.on('error', (e) => {

    throw e;
  });
  req.write(payload);
  req.end();

})();


