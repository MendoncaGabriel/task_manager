# Desafio 01 - Fundamentos do Node.js

API desenvolvida para gerenciar *tasks* (tarefas), com operações de CRUD e importação de dados via arquivo CSV. Este projeto faz parte do primeiro desafio da trilha de Node.js do Ignite da Rocketseat.

## Funcionalidades

1. **Criação de task**: Crie uma nova tarefa com título e descrição.
2. **Listagem de tasks**: Visualize todas as tarefas e filtre por título ou descrição.
3. **Atualização de task**: Atualize o título e/ou descrição de uma tarefa existente.
4. **Remoção de task**: Exclua uma tarefa pelo `id`.
5. **Marcar task como completa**: Altere o status de conclusão da tarefa.
6. **Importação de tasks via CSV**: Importe múltiplas tarefas em massa através de um arquivo CSV.

## Estrutura da Task

- `id`: Identificador único da task.
- `title`: Título da task.
- `description`: Descrição detalhada.
- `completed_at`: Data de conclusão da task (inicia como `null`).
- `created_at`: Data de criação da task.
- `updated_at`: Data da última atualização da task.

## Rotas

### Criar Task
- **POST** `/tasks`
- **Body**: `{ "title": "string", "description": "string" }`
- Cria uma nova task e define automaticamente `id`, `created_at`, `updated_at`, `completed_at` (inicia como `null`).

### Listar Tasks
- **GET** `/tasks`
- Retorna todas as tasks. Permite busca por `title` e `description` como parâmetros de query.

### Atualizar Task
- **PUT** `/tasks/:id`
- **Body**: `{ "title": "string", "description": "string" }`
- Atualiza `title` ou `description` de uma task pelo `id`.

### Remover Task
- **DELETE** `/tasks/:id`
- Remove uma task pelo `id`.

### Marcar como Completa
- **PATCH** `/tasks/:id/complete`
- Alterna o status de conclusão de uma task.

### Importar Tasks via CSV
- **Formato**: CSV com colunas `title` e `description`.
- Realiza a criação de múltiplas tasks a partir do CSV.

## Validações Extras

- Verificação de presença dos campos `title` e `description` nas rotas `POST` e `PUT`.
- Nas rotas com `/:id`, validação de existência do `id` no banco de dados e mensagem de erro se não existir.
