// Define links as JSON objecs to use in website
personalPageLink = { "name": "Personal Page", "url": "http://people.tamu.edu/~mpatranella/csce315PersonalPage/index.html" };
gitHubLink = { "name": "GitHub", "url": "https://github.com/mpmorgan94" };
cloudflareLink = { "name": "Cloudflare", "url": "https://www.cloudflare.com/" };

// Create Array of the defined links
var myLinksArray = [personalPageLink, gitHubLink, cloudflareLink];

console.log("github url: " + myLinksArray[1].url);

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  return new Response(myLinksArray, {
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  })
}