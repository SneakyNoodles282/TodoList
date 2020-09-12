const express = require('express');
const router = express.Router();
let todos = [
    {
      "text": "hi",
      "id": "2.378",
      "checked": "false"
    },
    {
      "text": "hi",
      "id": "2.3786333765439",
      "checked": "false"
    },
    {
      "text": "hi",
      "id": "2.3786333",
      "checked": "false"
    }
  ];


router.get('/list-items', (req, res) => {
    res.json(todos)
});


router.post('/list-items/new', (req, res) => {
    todos.push(req.body)
    res.json(todos)
});

router.delete('/list-items', (req, res) => {
    todos = []
    res.json(todos)
});

router.delete('/list-items/:id', (req, res) =>{
    const id = req.params.id;
    todos = todos.filter(todo => todo.id !== id)
    res.json(todos)

})

router.post('/list-items/update/:id', (req,res) =>{
    const id = req.params.id;
    let updatedTodo = todos.find(todo => todo.id === id)
    todos = todos.filter(todo => todo.id !== id)
    updatedTodo.checked = true
    console.log(updatedTodo)
    todos.push(updatedTodo)
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