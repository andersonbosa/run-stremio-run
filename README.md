# RAN STREMIO RAN

> URL Redirection App

## Overview

This simple web application allows users to dynamically add and redirect to URLs within a local network. It is built using Node.js with Express on the server-side and HTML with JavaScript on the client-side.

## Features

- **Dynamic URL Addition:** Users can add new URLs to the application, and the list dynamically updates without the need for page reloads.
  
- **URL Redirection:** Clicking on a listed URL redirects the user to the specified destination.

- **User Authentication (Optional):** User authentication can be enabled to secure certain functionalities.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/andersonbosa/ran-stremio-ran.git
cd url-redirection-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```
The application will be available at http://localhost:8080 by default.

## Usage

### Web page

1. Open the application in a web browser.
2. Add URLs using the "Add URL" form.
3. Click on a listed URL to redirect to the specified destination.
4. Optionally, enter a domain to replace links dynamically.

### Browser script (Made to be used with ViolentMonkey)

When you click the "Copy Stream Link" button (Image 1) the script will make the request for API saving the URL and displaying on the homepage.
> imagem 1
> ![Alt text](docs/image.png)

### Configuration
Authentication: User authentication can be enabled or disabled by modifying the SHOULD_AUTHENTICATE variable in src/index.js.

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## License
This project is licensed under the MIT License.

