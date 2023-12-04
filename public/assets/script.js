/**
 * Constants for user authentication and notifications.
 */
const USERNAME = 'admin' // For demonstration purposes
const USERPASSWORD = 'password123'

const NOTIFICATIONS = {
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error'
  },
  MESSAGES: {
    SOMETHING_WRONG: 'Something goes wrong.'
  }
}

/**
 * Get basic authentication token using base64 encoding.
 * @returns {string} Basic authentication token.
 */
function getBasicAuth () {
  return btoa(`${USERNAME}:${USERPASSWORD}`)
}

/**
 * Update href property of anchor tags based on user input.
 */
function updateHref () {
  const domainInput = document.getElementById('domainInput')
  const domain = domainInput.value.trim()

  const anchorTags = document.querySelectorAll('#urlList a')
  anchorTags.forEach(tag => {
    tag.href = `${tag.href.split('//')[0]}//${domain}${tag.pathname}${tag.search}${tag.hash}`
  })
}

/**
 * Show notifications to the user.
 * @param {string} message - Notification message.
 * @param {string} type - Notification type (success or error).
 * @param {Object} userOptions - Additional options for the notification.
 * @returns {Object} Toastify instance.
 */
function notify (message, type, userOptions = {}) {
  let backgroundColor = JSON.stringify(NOTIFICATIONS.TYPES).includes(type)
    ? (
      type === NOTIFICATIONS.TYPES.SUCCESS
        ? 'limegreen'
        : 'lightcoral'
    )
    : undefined

  const defaultOptions = {
    text: message,
    style: {
      background: backgroundColor,
    },
    duration: 3000,
    stopOnFocus: true
  }

  const toastOptions = Object.assign(defaultOptions, userOptions)
  return Toastify(toastOptions).showToast()
}

/**
 * Create a list element from a string URL.
 * @param {string} url - The URL to create a list element for.
 * @returns {HTMLLIElement} List item element.
 */
function createListElement (url) {
  if (!url) {
    throw new Error('Missing URL')
  }
  const listItem = document.createElement('li')
  const link = document.createElement('a')

  link.href = url
  link.textContent = url

  listItem.appendChild(link)
  return listItem
}

/**
 * Load data from a JSON file and update the page.
 * @returns {Promise<void>} A Promise that resolves when the data is loaded.
 */
async function loadDataToPage () {
  try {
    const response = await fetch('data.json')
    const data = await response.json()

    const urlList = document.getElementById('urlList')
    urlList.innerHTML = ''

    data.forEach(dataUnit => {
      const listItem = createListElement(dataUnit)
      urlList.appendChild(listItem)
    })

  } catch (error) {
    console.error('Error fetching URLs:', error)
  }
}

/**
 * API function to reload data on the page.
 */
async function apiReloadData () {
  loadDataToPage()
    .then(() => {
      notify('Loaded data.', NOTIFICATIONS.TYPES.SUCCESS)
    })
    .catch(err => {
      console.error(err)
      notify('Something wrong loading data', NOTIFICATIONS.TYPES.ERROR)
    })
}

/**
 * API function to reset all URLs.
 */
function apiResetURls () {
  fetch(`/api/v1/url/reset`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + getBasicAuth() // For demonstration purposes
    },
  })
    .then(response => {
      if (response.ok) {
        loadDataToPage()
        notify('All URLs were erased.', NOTIFICATIONS.TYPES.SUCCESS)
      }
    })
    .catch(error => {
      console.error(NOTIFICATIONS.MESSAGES.SOMETHING_WRONG, error)
      notify(NOTIFICATIONS.MESSAGES.SOMETHING_WRONG, NOTIFICATIONS.TYPES.ERROR)
    })
}

/**
 * API function to add a new URL.
 */
function apiAddURL () {
  const urlInput = document.getElementById('urlInput')
  const url = urlInput.value.trim()

  if (!url) {
    notify('Missing URL.', NOTIFICATIONS.TYPES.ERROR)
    return
  }

  fetch(`/api/v1/url/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + getBasicAuth() // For demonstration purposes
    },
    body: JSON.stringify({ url })
  })
    .then(response => response.json())
    .then(jsonResponse => {
      console.log(jsonResponse)
      if (jsonResponse.success) {
        loadDataToPage()
        notify('URL added successfully', NOTIFICATIONS.TYPES.SUCCESS)
      } else {
        notify(jsonResponse.message, NOTIFICATIONS.TYPES.ERROR)
      }
    })
    .catch(error => {
      console.error('Error adding URL:', error)
      notify('Error adding URL. Please try again.', NOTIFICATIONS.TYPES.ERROR)
    })
}

/**
 * Function executed on window load to initialize the page.
 */
window.onload = () => {
  loadDataToPage()
  notify("Welcome!", undefined, { duration: 1000 })
  setInterval(loadDataToPage, 5000)
}
