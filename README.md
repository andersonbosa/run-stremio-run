# RUN STREMIO RUN!!

## Goals

- [x] Provide local Stremio server
- [x] Make the user obtain a connection between Stremio Web and Local Stremio Server with **1 click**.

## Overview

> If you like the project, give it a Star! 🌟

This is a simple web application that allows users to connect their local Stremio Server to Stremio Web to watch what they want.

It is built using Node.js with Express on the server-side and HTML with JavaScript on the client-side. Everything was tied using docker and docker compose

![Video demo](docs/demo.webm)

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- OR Docker with Compose plugin

### Additional resources

- Install Stremio addons from https://stremio-addons.netlify.app
  - I recommend you install at least **Torrentio**
<!-- - Browser script [violentMonkey.user.js](docs/violentMonkey.user.js) -->

### Installation

The application will be available at http://localhost:8080 by default.


#### Docker (RECOMMENDED)

```bash
git clone https://github.com/andersonbosa/run-stremio-run.git
cd run-stremio-run
make start
``` 

#### Manually
1. Clone the repository:

```bash
git clone https://github.com/andersonbosa/run-stremio-run.git
cd run-stremio-run
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```


## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## License
This project is licensed under the [CC0 License](./LICENSE).

