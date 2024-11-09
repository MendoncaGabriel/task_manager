import { randomUUID } from "node:crypto"
import fs from "node:fs/promises"

const databasePath = new URL("db.json", import.meta.url)

export default class Database {
  #database = {}

  constructor() {
    this.#initializeDatabase()
  }

  async #initializeDatabase() {
    try {
      const data = await fs.readFile(databasePath, "utf8")
      this.#database = JSON.parse(data)
    } catch {
      this.#database = {} 
      await this.#persist()
    }
  }

  async #persist() {
    try {
      const databaseInString = JSON.stringify(this.#database, null, 2)
      await fs.writeFile(databasePath, databaseInString)

      const updatedData = await fs.readFile(databasePath, "utf8")
      this.#database = JSON.parse(updatedData)
    } catch (err) {
      console.error("Erro ao persistir e sincronizar dados:", err)
    }
  }

  select({ table, search }) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key]?.includes(value)
        })
      })
    }

    return data
  }

  async insert({ table, data }) {
    data.id = randomUUID()

    if (!this.#database[table]) {
      this.#database[table] = []
    }

    this.#database[table].push(data)

    await this.#persist()

    return data
  }

  async delete({ table, id }) {
    if (!this.#database[table]) return

    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      await this.#persist()
    }
  }

  async update({ table, id, data }) {
    if (!this.#database[table]) {
      throw new Error("Tabela não encontrada")
    }

    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        ...this.#database[table][rowIndex],
        ...data
      }
      await this.#persist()
      return this.#database[table][rowIndex]
    } else {
      throw new Error("Item não encontrado")
    }
  }
}
