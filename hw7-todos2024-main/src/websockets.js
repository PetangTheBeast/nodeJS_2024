import { WebSocketServer } from 'ws'
import ejs from 'ejs'
import { db, getAllTodos, getTodoById } from './db.js'

const connections = new Set()

export const createWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (socket) => {
    connections.add(socket)

    console.log('New connection', connections.size)

    socket.on('close', () => {
      connections.delete(socket)

      console.log('Closed connection', connections.size)
    })
  })
}

export const sendTodoListToAllConnections = async () => {
  const todoList = await ejs.renderFile('views/_todos.ejs', {
    todos: await getAllTodos(),
  })

  for (const connection of connections) {
    connection.send(
      JSON.stringify({
        type: 'todoList',
        html: todoList,
      })
    )
  }
}

export const sendTodoToAllConnections = async (id, deleted = false) => {
  const todoObject = await getTodoById(id)
  var todoHtml
  var title = todoObject.title
  if(deleted) {
    todoHtml = await ejs.renderFile('views/_deletedTodo.ejs', {
      todo: todoObject,
    })
    title = todoObject.title + " - deleted"
  }
  else{
    todoHtml = await ejs.renderFile('views/_todo.ejs', {
      todo: todoObject,
    })
  }
  

  for (const connection of connections) {
    connection.send(
      JSON.stringify({
        type: 'todo',
        id: todoObject.id.toString(),
        title: title,
        html: todoHtml,
      })
    )
  }
}
