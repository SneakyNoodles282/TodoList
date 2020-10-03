const express = require('express');
const router = express.Router();
const { getDB } = require("../lib/db")


let todos = [
    {
      "text": "hi",
      "id": 2.378,
      "checked": false
    },
    {
      "text": "hii",
      "id": 2.3786333765439,
      "checked": false
    },
    {
      "text": "hiii",
      "id": 2.3786333,
      "checked": false
    }

  ];

  // let todos = db

router.get('/list-items', async (req, res) => {
    const db = getDB()
    const docs = await db.find({}).toArray()
    res.json(docs)

});


router.post('/list-items/new', async (req, res) => {
  const db = getDB()
  const text = req.body.text
  const id = req.body.id
  const checked = req.body.checked


  const newTodo = {
    text,
    id: parseFloat(id),
    checked: checked === 'true'
  }

  if(!newTodo.text){
    res.status(400).json({error:"Task Is Empty"})
    return
  }
  if(!newTodo.id|| isNaN(newTodo.id)){
    res.status(400).json({error:"Invalid ID"})
    return
  }
  await db.insertOne(newTodo)
  res.json(newTodo)
});

router.delete('/list-items', async (req, res) => {
    const db = getDB()
    await db.deleteMany({})
    res.json({})
});

router.delete('/list-items/:id', (req, res) =>{
    const id = parseFloat(req.params.id);
    let deleteTodo = todos.find(todo => todo.id === id)
    if(deleteTodo === undefined){
      res.status(404).json({error:"List Item Doesn't Exist"})
      return
    }
    todos = todos.filter(todo => todo.id !== id)
    res.json(todos)
    

})

router.post('/list-items/update/:id', (req,res) =>{
    const id = parseFloat(req.params.id);
    let updatedTodo = todos.find(todo => todo.id === id)
    todos = todos.filter(todo => todo.id !== id)
    if(updatedTodo === undefined){
      res.status(404).json({error:"List Item Doesn't Exist"})
      return
    } 
    updatedTodo.checked = !updatedTodo.checked;

    if (updatedTodo.checked) {
      todos.push(updatedTodo)
    } else {
      todos.unshift(updatedTodo)
    }
    res.json(todos)
})

module.exports = router
/**
 * Home
 * get / 
 * TodoList
 * get /api/list-items - get list data (get list) done
 * post /api/list-items/new - add todo to list done
 * DELETE /api/list-items - remove all list data done
 * DELETE /api/list-item/:id - delete by id (listItem in list TodoList) done
 * post /api/list-item/update/:id - check uncheck(add/remove class)
 */