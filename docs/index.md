# docs/index.md

## Features

- **Dynamic URL Addition:** Users can add new URLs to the application, and the list dynamically updates without the need for page reloads.
- **URL Redirection:** Clicking on a listed URL redirects the user to the specified destination.
- **User Authentication (Optional):** User authentication can be enabled to secure certain functionalities.

## Usage

### Web page

1. Open the application in a web browser.
2. Add URLs using the "Add URL" form.
3. Click on a listed URL to redirect to the specified destination.
4. Optionally, enter a domain to replace links dynamically.
<!-- 
### Browser script (Made to be used with ViolentMonkey)

When you click the "Copy Stream Link" button (vide image 1) the script will make the 
request for API store the URL and displaying on the homepage (default http://localhost:8080).
> Image 1: Copy stream link from https://web.stremio.com
> ![Alt text](docs/image.png)

> Image 2: URL stored via API
>![Alt text](docs/image2.png)
 -->
### Configuration
Authentication: User authentication can be enabled or disabled by modifying the SHOULD_AUTHENTICATE variable in src/index.js.
