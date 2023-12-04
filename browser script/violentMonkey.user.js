// ==UserScript==
// @name        Stremio Copy Stream Link Listener
// @match       https://web.stremio.com/*
// @grant       GM_setClipboard
// @version     1.0
// @author      Anderson Bosa < @t4inha > 
// @description Listens for clicks on elements with the text 'copy stream link' and makes a POST request with clipboard content to a API.
// ==/UserScript==


const LOCAL_MACHINE_IP = '192.168.0.5'       // Change as you need
const STREMIO_SERVER_IP = '172.17.0.2' // Change as you need

const USERNAME = 'admin' // For demonstration purposes
const USERPASSWORD = 'password123'

function getBasicAuth () {
  return btoa(`${USERNAME}:${USERPASSWORD}`)
}

function getAPIAddress () {
  return 'localhost:8080'
}

function updateURlDomain (originalUrl, newDomain) {
  const url = new URL(originalUrl)
  url.hostname = newDomain
  return url.href
}

function mainScript () {
  document.addEventListener('click', async event => {
    const isExpectedTarget = event.target.outerHTML.toLowerCase().includes('copy stream link')
    if (!isExpectedTarget) return

    const clipboardContent = await navigator.clipboard.readText()
    const urlToStore = clipboardContent.replace(STREMIO_SERVER_IP, LOCAL_MACHINE_IP)

    console.log("clipboardContent: ", clipboardContent)

    const apiUrl = `http://${getAPIAddress()}/api/v1/url/add/`

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + getBasicAuth() // For demonstration purposes
      },
      body: JSON.stringify({ url: urlToStore })
    })
      .then(response => response.json())
      .then(data => {
        console.log('POST request successful:', data)
      })
      .catch(error => {
        console.error('Error making POST request:', error)
      })
  })
}
setTimeout(mainScript, 500)


function helperScript () {
  const getReloadBtn = () => document.querySelector("#app .routes-container [class*=sections-container] [title*=Reload]")

  setInterval(
    () => {
      btn = getReloadBtn()
      if (!btn) return
      btn.click()
    },
    2000
  )
}
setTimeout(helperScript, 100)