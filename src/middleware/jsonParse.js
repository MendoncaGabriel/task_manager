export default async function jsonParse(req, res){
  try {
    const buffers = []

    for await (const chunk of req) {
      buffers.push(chunk)
    }

    const concatBuffer = Buffer.concat(buffers)
    const bufferString = concatBuffer.toString('utf8')
    const dataJson = JSON.parse(bufferString)

    req.body = dataJson
  } catch  {
    req.body = null
  }

  res.setHeader("Content-Type", "application/json")
}