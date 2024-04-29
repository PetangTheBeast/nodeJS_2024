import test from "ava"
import supertest from "supertest"
import { app } from "../src/app.js"
import { db } from "../src/db.js"

test.beforeEach(async () => {
  await db.migrate.latest()
})

test.afterEach(async () => {
  await db.migrate.rollback()
})

test.serial("it renders a list of todos", async (t) => {
  const response = await supertest.agent(app).get("/")

  t.assert(response.text.includes("<h1>Todos</h1>"))
})

test.serial("create new todo", async (t) => {
  await db("todos").insert({
    title: "Moje todo",
  })

  const response = await supertest.agent(app).get("/")

  t.assert(response.text.includes("Moje todo"))
})

test.serial("create new todo via form", async (t) => {
  const response = await supertest
    .agent(app)
    .post("/add-todo")
    .type("form")
    .send({ title: "Nějaký název" })
    .redirects(1)

  t.assert(response.text.includes("Nějaký název"))
})

test.serial("update todo via form", async (t) => {
  const [todo] = await db("todos")
    .insert({
      title: "Moje todo",
    })
    .returning("*")

  const response = await supertest
    .agent(app)
    .post(`/update-todo/${todo.id}`)
    .type("form")
    .send({ title: "Tvoje todo" })
    .redirects(1)

  t.assert(response.text.includes("Tvoje todo"))
})

test.serial("remove todo", async (t) => {
  const [todo] = await db("todos")
    .insert({
      title: "Moje todo",
    })
    .returning("*")

  const response = await supertest
    .agent(app)
    .get(`/remove-todo/${todo.id}`)
    .redirects(1)

  t.assert(!response.text.includes("Tvoje todo"))
})

test.serial("toggle todo", async (t) => {
  const [todo] = await db("todos")
    .insert({
      title: "Moje todo",
    })
    .returning("*")

  const response = await supertest
    .agent(app)
    .get(`/toggle-todo/${todo.id}`)
    .redirects(1)

  t.assert(response.text.includes("hotovo"))
})

test.serial("todo detail", async (t) => {
  const [todo] = await db("todos")
    .insert({
      title: "Moje todo",
    })
    .returning("*")

  const response = await supertest
    .agent(app)
    .get(`/todo/${todo.id}`)

  t.assert(response.text.includes("Moje todo"))
})

test.serial("404 page", async (t) => {
  const response = await supertest
    .agent(app)
    .get("/todo/9001")

  t.is(response.status, 404)
  t.assert(
    response.text.includes("404 - Stránka nenalezena")
  )
})
