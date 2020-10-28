const express = require('express');
const router = express.Router();
const { getTodos } = require("../lib/db")

router.get('/list-items', async (req, res) => {
    const db = getTodos()
    const docs = await db.find({ userID: req.user._id }).toArray()
    res.json(docs)

});

router.post('/list-items/new', async (req, res) => {
  const db = getTodos()
  const text = req.body.text
  const id = req.body.id
  const checked = req.body.checked


  const newTodo = {
    text,
    id: parseFloat(id),
    checked: checked === 'true',
    userID: req.user._id
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
    const db = getTodos()
    await db.deleteMany({})
    res.json({})
});

router.delete('/list-items/:id', async (req, res) =>{
    const id = parseFloat(req.params.id);
    const db = getTodos()
    const result = await db.deleteOne({ id });
    if(result.deletedCount === 0){
      res.status(404).json({error:"List Item Doesn't Exist"})
      return
    }
    const docs = await db.find({}).toArray()
    res.json(docs)
})

router.post('/list-items/update/:id', async (req,res) =>{
    const id = parseFloat(req.params.id);
    const db = getTodos()
    const filter = { id }
    const updatedTodo = await db.findOne(filter)
    if(!updatedTodo){
      res.status(404).json({error:"List Item Doesn't Exist"})
      return
    } 
    const updatedDoc = {
      $set: {
        checked: !updatedTodo.checked
      }
    }
    const result = await db.updateOne(filter, updatedDoc)
    const docs = await db.find({}).toArray()
    res.json(docs)
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