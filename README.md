
# API Project: URL Shortener Microservice for freeCodeCamp
Hosted  here: https://raahelpie-url-shortener.glitch.me/

### Working

1. Paste the URL you want to shorten in the form in the above webpage. When submitted, the form sends a POST request to the /api/shorturl/new endpoint.
2. If your URL is valid, you will get JSON object as a response which has a code (id), you can replace the id in the :id part of this url: https://raahelpie-url-shortener.glitch.me/api/shorturl/:id/
3. You will be redirected to your original link upon going to that link.
4. If the URL is already present in the database, it will return the id corresponding to it, else - it will create a new document for it and assign a new id.
5. YOU ONLY HAVE TO REMEMBER THE ID THE NEXT TIME YOU WANT TO GO BACK TO THE SAME PAGE.


#### Creation Example:

POST https://raahelpie-url-shortener.glitch.me/api/shorturl/new - body (urlencoded) :  url=https://www.google.com

#### Usage:

https://raahelpie-url-shortener.glitch.me/api/shorturl/5

#### Will redirect to:

https://raahelbaig.netlify.app/