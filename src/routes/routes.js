import Database from "../database/database.js"
import buildRouthPath from "../utils/buildRouthPath.js"
import Task from "../entities/task.js"
import csvToJson from "../utils/csvToJson.js"

const db = new Database()

const routes = [
  {
    method: "POST",
    path: buildRouthPath("/tasks/bulk-import"),
    handle: async (req, res) => {
      if (req.file) {

        const cvsSring = req.file
        const csvJson = csvToJson(cvsSring)
        const errosInserts = []

        csvJson.forEach(async element => {
          const { id, title, description, completed_at, created_at, updated_at } = element

          const task = new Task({
            id,
            title,
            description,
            completed_at,
            created_at,
            updated_at
          })


          try {
            await db.insert({
              table: "tasks",
              data: task
            })
          } catch (error) {
            errosInserts.push(error)
          }
        })

        if (errosInserts.length == 0) {
          return res.writeHead(200).end()
        } else {
          return res.writeHead(200).end(JSON.stringify(errosInserts))
        }

      } else {
        return res.writeHead(400).end("Nenhum arquivo encontrado.")
      }
    }
  },
  {
    method: "GET",
    path: buildRouthPath("/tasks"),
    handle: async (req, res) => {
      const { id } = req.query

      const data = db.select({
        table: "tasks",
        search: id ? { id } : undefined
      })

      const dataString = JSON.stringify(data)

      if (data) {
        return res.writeHead(200).end(dataString)
      }

      return res.writeHead(200).end()
    }
  },
  {
    method: "POST",
    path: buildRouthPath("/tasks"),
    handle: async (req, res) => {
      const { title, description } = req.body

      const task = new Task({
        title,
        description,
      })

      await db.insert({
        data: task,
        table: "tasks"
      })

      return res.writeHead(200).end()
    }
  },
  {
    method: "PUT",
    path: buildRouthPath("/tasks/:id"),
    handle: (req, res) => {
      const { title, description } = req.body
      const { id } = req.params

      try {
        db.update({
          data: {
            title,
            description,
            updated_at: Date.now()
          },
          table: "tasks",
          id
        })
      } catch (error) {
        return res.writeHead(404).end(error.message)
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: "DELETE",
    path: buildRouthPath("/tasks/:id"),
    handle: (req, res) => {
      const { id } = req.params

      db.delete({
        id,
        table: "tasks"
      })

      return res.writeHead(200).end()
    }
  },
  {
    method: "PUT",
    path: buildRouthPath("/tasks/:id/mark-as-complete"),
    handle: async (req, res) => {
      const { id } = req.params

      const tasks = db.select({
        table: "tasks",
        search: { id }
      })

      if (tasks.length === 0) {
        return res.writeHead(404).end(JSON.stringify({ message: "Task not found with id" }))
      }

      const task = tasks[0]

      let updatedTask

      try {

        if (task.completed_at == null) {
          updatedTask = await db.update({
            data: {
              completed_at: new Date().toISOString()
            },
            table: "tasks",
            id
          })
        } else {
          updatedTask = await db.update({
            data: {
              completed_at: null
            },
            table: "tasks",
            id
          })
        }

        return res.writeHead(200).end(JSON.stringify(updatedTask))
      } catch (error) {
        return res.writeHead(400).end(JSON.stringify(error))
      }
    }
  }
]

export default routes
