import { randomUUID } from "crypto"

export default class Task {
  constructor({ 
    title, 
    description,
    id,
    completed_at,
    created_at,
    updated_at

  }) {
    const now = Date.now()
    this.id = id ? id : randomUUID()
    this.title = title
    this.description = description
    this.completed_at = completed_at ? completed_at : null
    this.created_at = created_at ? created_at : now
    this.updated_at = updated_at ? updated_at : now
  }
}