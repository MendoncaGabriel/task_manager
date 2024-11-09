import server from "node:http"
import routes from "./routes/routes.js"
import extractQueryParams from "./utils/extractQueryParams.js"
import jsonParse from "./middleware/jsonParse.js"
import uploadFile from "./middleware/uploadFile.js"

const app = server.createServer(async (req, res) => {
  await uploadFile(req, res)
  await jsonParse(req, res)

  const { method, url } = req

  const route = routes.find(route => {
    if (
      route.method === method &&
      route.path.test(url)
    ) {
      return route
    }
  })

  if (route) {
    const routeParams = req.url.match(route.path)
    const { query, ...params } = routeParams.groups

    req.params = params ? params : {}
    req.query = query ? extractQueryParams(query) : {}

    return route.handle(req, res)
  }

  return res.writeHead(404).end()
});

const PORT = 3000

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
