// Author: John Patranella
// References: https://developers.cloudflare.com/workers/ 
// Cloudflare Workers documentation

// Define links as JSON objecs
personalPageLink = { "name": "Personal Page", "url": "http://people.tamu.edu/~mpatranella/csce315PersonalPage/index.html" };
gitHubLink = { "name": "GitHub", "url": "https://github.com/mpmorgan94" };
cloudflareLink = { "name": "Cloudflare", "url": "https://www.cloudflare.com/" };

// Define social svgs/links as JSON objects
facebookLink = { "svg": "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">" +
"<title>Facebook icon</title><path d=\"M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5." +
"37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 " +
"6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.33" +
"88 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.99" +
"81 17.9882 23.9981 11.9991Z\"/></svg>", "url": "https://www.facebook.com/" };
twitterLink = { "svg": "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">" +
  "<title>Twitter icon</title><path d=\"M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.1" +
  "63-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39." +
  "045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.80" +
  "7-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.0" +
  "86.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2." +
  "209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z\"/></svg" +
  ">", "url": "https://www.twitter.com" };

// Create Array of the defined links and social links
var mySocials = [facebookLink, twitterLink];
var myLinksArray = [personalPageLink, gitHubLink, cloudflareLink];
const json = JSON.stringify(myLinksArray, null, 2)

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Will modify the retrieved html and add my links
class LinksTransformer {

  constructor(attributeName) {
    this.attributeName = attributeName;
  }

  async element(element) {
    // Append links to links div
    var i;
    for (i = 0; i < myLinksArray.length; i++) {
      element.append('\n        ');
      element.append('<a href=' + myLinksArray[i].url + '>'
        + myLinksArray[i].name + '</a>', {html: true});
    }
    element.append('\n      ');
    
  }
}

// Will modify the retrieved html and add socials
class SocialsTransformer {

  constructor(attributeName) {
    this.attributeName = attributeName;
  }

  async element(element) {
    // Append links to links div
    var i;
    for (i = 0; i < mySocials.length; i++) {
      element.append('\n        ');
      element.append('<a href=' + mySocials[i].url +
        '>' + mySocials[i].svg + '</a>', {html: true});
    }
    element.append('\n      ');
  }
}

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
  // Otherwise, fetch static page and serve it
  else {
    const init = { headers: {"content-type": "text/html;charset=UTF-8",},}
    const response = await fetch("https://static-links-page.signalnerve.workers.dev", init);
    return rewriter.transform(response);
  }
}

// The html rewriter which modifies html documents held in the server
const rewriter = new HTMLRewriter()
  .on("div#links", new LinksTransformer("href"))
  .on("div#social", new SocialsTransformer("href"))
  .on("h1#name", { element: (element) => element.setInnerContent("John Patranella") })
  .on("div#profile", { element: (element) => element.removeAttribute("style") })
  .on("div#social", { element: (element) => element.removeAttribute("style") })
  .on("img#avatar", { element: (element) =>
    element.setAttribute("src", "https://scontent-dfw5-1.xx." +
    "fbcdn.net/v/t1.0-9/34175279_2001306963247680_7978456408691" +
    "572736_n.jpg?_nc_cat=110&_nc_sid=85a577&_nc_ohc=P0sfLB2srQwAX" +
    "8gxVtw&_nc_ht=scontent-dfw5-1.xx&oh=7ab60ca0ae56ce4e1ff409857ba4" +
    "4786&oe=5FA4F2DC") })
  .on("title", { element: (element) => element.setInnerContent("John Patranella") })
  .on("body", { element: (element) => element.setAttribute("class", "bg-orange-500") })