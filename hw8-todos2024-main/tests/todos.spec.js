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

//Tedy toggle todočka, 
test.serial("toggle todo via endpoint False -> True", async (t) => {
  await db("todos").insert({
    id: 1,
    title: "Moje todo",
    done: false // nehotovo
  })

  await supertest.agent(app).get("/toggle-todo/1")

  const response = await supertest.agent(app).get("/")

  t.assert(response.text.includes("hotovo"))
})

test.serial("toggle todo via endpoint Talse -> false", async (t) => {
  await db("todos").insert({
    id: 1,
    title: "Moje todo",
    done: true // hotovo
  })

  await supertest.agent(app).get("/toggle-todo/1")

  const response = await supertest.agent(app).get("/")

  t.assert(response.text.includes("nehotovo"))
})

// aktualizace údajů na todočku
test.serial("update todo info via form", async (t) => {
  await db("todos").insert({
    id: 1,
    title: "Moje todo",
    done: false,
    priority: 'low'
  })

  const response = await supertest
    .agent(app)
    .post("/update-todo/1")
    .type("form")
    .send({ title: "Nějaký název", priority: 'high' })
    .redirects(1)
    // console.log("*******")
    // console.log(response.text)
    // console.log("*******")
  t.assert(response.text.includes("Nějaký název"))
  t.assert(response.text.includes("high"))
})

// mazání todočka a 
test.serial("delete todo via endpoint", async (t) => {
  await db("todos").insert({
    id: 1,
    title: "Moje todo",
    done: false,
    priority: 'low'
  })

  await supertest.agent(app).get("/remove-todo/1")

  const response = await supertest.agent(app).get("/")

  t.assert(!response.text.includes("Moje todo"))
})

// mazani spravneho todo
test.serial("delete correct todo via endpoint", async (t) => {
  await db("todos").insert({
    id: 1,
    title: "Moje todo",
    done: false,
    priority: 'low'
  })

  await db("todos").insert({
    id: 2,
    title: "Tvoje todo",
    done: false,
    priority: 'low'
  })

  await supertest.agent(app).get("/remove-todo/1")
  
  const response = await supertest.agent(app).get("/")

  t.assert(!response.text.includes("Moje todo"))
  t.assert(response.text.includes("Tvoje todo"))
})

// zobrazení detailu todočka
test.serial("get todo detail", async (t) => {
  await db("todos").insert({
    id: 1,
    title: "Moje todo",
    done: false,
    priority: 'low'
  })

  const response = await supertest.agent(app).get("/todo/1")

  t.assert(response.text.includes("Moje todo"))
})

// Co se stane když se poikusím založit točko bez názvu?

// Co se stane když do URL na detail todočka, zadám ID todočka, které neexistuje

// co když se poksím smazat todo, které neexistuje, ..