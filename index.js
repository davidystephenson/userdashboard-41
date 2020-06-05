const express = require('express')
const axios = require('axios')

const app = express()

const port = 3000

function onTest (request, response) {
  response.send('test!')
}

app.get('/test', onTest)

function render (content) {
  return `<html>
    <head>
      <title>User Dashboard</title>
    </head>
    <body>
      <h1>User Dashboard</h1>
      ${content}
    </body>
  </html>`
}

async function onAll (request, response) {
  try {
    const users = await axios.get('http://localhost:4000/users')

    const content = users.data.map(
      function (user) {
        return `<p>
          <a href="/single-user/${user.name}">
            ${user.name}
          </a>
        </p>`
      }
    )
    const joined = content.join('')

    const webpage = render(joined)

    response.send(webpage)
  } catch (error) {
    console.log(error.message)
  }
}

app.get('/all-users', onAll)

async function onSingle (request, response) {
  try {
    const url = `http://localhost:4000/user/${request.params.name}`

    const single = await axios.get(url)

    const content = `<div>
      <h2>Name</h2>
      <p>${single.data.name}</p>
      <h2>Hours</h2>
      <p>${single.data.hours}</p>
      <h2>Website</h2>
      <p>${single.data.website}</p>
    </div>`

    const webpage = render(content)

    response.send(webpage)
  } catch (error) {
    console.log(error.message)
  }
}

app.get('/single-user/:name', onSingle)

app.listen(
  port,
  function () {
    console.log(`Listening on :${port}`)
  }
)