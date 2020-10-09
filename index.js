// Define links as JSON objecs to use in website
personalPageLink = { "name": "Personal Page", "url": "http://people.tamu.edu/~mpatranella/csce315PersonalPage/index.html" };
gitHubLink = { "name": "GitHub", "url": "https://github.com/mpmorgan94" };
cloudflareLink = { "name": "Cloudflare", "url": "https://www.cloudflare.com/" };

// Create Array of the defined links
var myLinksArray = [personalPageLink, gitHubLink, cloudflareLink];
const json = JSON.stringify(myLinksArray, null, 2)

// Testing
console.log("github url: " + myLinksArray[1].url);

addEventListener('fetch', event => {
  console.log(event.request.url);
  event.respondWith(handleRequest(event.request))
})

/**
 * Determine how we want to respont to given request
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.url.includes("/links") && request.url.endsWith("/links")) {
    return new Response(json, {
      headers: { 'content-type': "application/json;charset=UTF-8",
                  'status': 500},
    })
  }
  else {
    return new Response("Other Response", {
      headers: { 'content-type': "text/plain" },
    })
  }
}