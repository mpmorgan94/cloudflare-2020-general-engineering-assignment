// Define links as JSON objecs to use in website
personalPageLink = { "name": "Personal Page", "url": "http://people.tamu.edu/~mpatranella/csce315PersonalPage/index.html" };
gitHubLink = { "name": "GitHub", "url": "https://github.com/mpmorgan94" };
cloudflareLink = { "name": "Cloudflare", "url": "https://www.cloudflare.com/" };

// Create Array of the defined links
var myLinksArray = [personalPageLink, gitHubLink, cloudflareLink];
const json = JSON.stringify(myLinksArray, null, 2)

addEventListener('fetch', event => {
  console.log(event.request.url);
  event.respondWith(handleRequest(event.request))
})

/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}

/**
 * Determine how we want to respont to given request
 * @param {Request} request
 */
async function handleRequest(request) {
  // If '/links' path, return the JSON containing links
  if (request.url.includes("/links") && request.url.endsWith("/links")) {
    return new Response(json, {
      headers: { 'content-type': "application/json;charset=UTF-8",
                  'status': 500},
    })
  }
  // Otherwise, fetch static page
  else {
    const init = { headers: {"content-type": "text/html;charset=UTF-8",},}
    const response = await fetch("https://static-links-page.signalnerve.workers.dev", init);
    //const result = response.text;
    const result = await gatherResponse(response);
    return new Response(result, init);
  }
}