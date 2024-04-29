import express from "express"
import cookieParser from "cookie-parser"
import { db, getAllTodos, getTodoById } from "./db.js"
import {
  sendTodoDeletedToAllConnections,
  sendTodoDetailToAllConnections,
  sendTodoListToAllConnections,
} from "./websockets.js"
import { createUser, getUserByToken } from "./users.js"

export const app = express()

app.set("view engine", "ejs")

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(async (req, res, next) => {
  const token = req.cookies.token
  if (!token) return next()
  res.locals.user = await getUserByToken(token)
  next()
})

const requiresAuth = (req, res, next) => {
  if (res.locals.user) {
    next()
  } else {
    res.redirect("/register")
  }
}

const checkThatTodoBelongsToCurentUser = async (
  req,
  res,
  next
) => {
  const todo = await getTodoById(req.params.id)
  if (todo.user_id === res.locals.user.id) return next()
  res.redirect("/")
}

app.get("/", async (req, res) => {
  const todos = await getAllTodos()

  res.render("index", {
    title: "Todos",
    todos,
  })
})

app.get("/todo/:id", async (req, res, next) => {
  const todo = await getTodoById(req.params.id)

  if (!todo) return next()

  res.render("todo", {
    todo,
  })
})

app.post("/add-todo", requiresAuth, async (req, res) => {
  const todo = {
    title: req.body.title,
    done: false,
    user_id: res.locals.user.id,
  }

  await db("todos").insert(todo)

  res.redirect("/")
})

app.post(
  "/update-todo/:id",
  requiresAuth,
  checkThatTodoBelongsToCurentUser,
  async (req, res, next) => {
    const todo = await getTodoById(req.params.id)

    if (!todo) return next()

    const query = db("todos").where("id", todo.id)

    if (req.body.title) {
      query.update({ title: req.body.title })
    }

    if (req.body.priority) {
      query.update({ priority: req.body.priority })
    }

    await query

    sendTodoListToAllConnections()
    sendTodoDetailToAllConnections(todo.id)

    res.redirect("back")
  }
)

app.get("/remove-todo/:id", async (req, res) => {
  const todo = await getTodoById(req.params.id)

  if (!todo) return next()

  await db("todos").delete().where("id", todo.id)

  sendTodoListToAllConnections()
  sendTodoDeletedToAllConnections(todo.id)

  res.redirect("/")
})

app.get("/toggle-todo/:id", async (req, res, next) => {
  const todo = await getTodoById(req.params.id)

  if (!todo) return next()

  await db("todos")
    .update({ done: !todo.done })
    .where("id", todo.id)

  sendTodoListToAllConnections()
  sendTodoDetailToAllConnections(todo.id)

  res.redirect("back")
})

app.get("/register", async (req, res) => {
  res.render("register")
})

app.post("/register", async (req, res) => {
  const user = await createUser(
    req.body.name,
    req.body.password
  )

  res.cookie("token", user.token)

  res.redirect("/")
})

app.use((req, res) => {
  res.status(404)
  res.send("404 - Stránka nenalezena")
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500)
  res.send("500 - Chyba na straně serveru")
})
