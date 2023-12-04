async function getUrlsFromJSON () {
  try {
    const response = await fetch('urls.json')
    const data = await response.json()

    const urlList = document.getElementById('urlList')
    urlList.innerHTML = ''

    data.forEach(url => {
      const listItem = document.createElement('li')
      const link = document.createElement('a')
      link.href = url
      link.textContent = url
      listItem.appendChild(link)
      urlList.appendChild(listItem)
    })
  } catch (error) {
    console.error('Error fetching URLs:', error)
  }
}

function addUrl () {
  const urlInput = document.getElementById('urlInput')
  const url = urlInput.value.trim()

  if (!url) {
    showNotification('Missing URL.', 'error')
    return
  }

  fetch(`/api/v1/url/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('admin:password123') // For demonstration purposes
    },
    body: JSON.stringify({ url })
  })
    .then(response => response.json())
    .then(jsonResponse => {
      console.log(jsonResponse)
      if (jsonResponse.success) {
        getUrlsFromJSON()
        showNotification('URL added successfully', 'success')
      } else {
        showNotification(jsonResponse.message, 'error')
      }
    })
    .catch(error => {
      console.error('Error adding URL:', error)
      showNotification('Error adding URL. Please try again.', 'error')
    })

}

function updateHref () {
  const domainInput = document.getElementById('domainInput')
  const domain = domainInput.value.trim()

  const anchorTags = document.querySelectorAll('#urlList a')
  anchorTags.forEach(tag => {
    tag.href = `${tag.href.split('//')[0]}//${domain}${tag.pathname}${tag.search}${tag.hash}`
  })
}

function showNotification (message, type) {
  const notification = document.getElementById('notification')
  notification.textContent = message
  notification.className = type

  setTimeout(
    async () => {
      notification.textContent = ''
      notification.className = ''
    },
    3000
  )
}

window.onload = () => {
  getUrlsFromJSON()
};