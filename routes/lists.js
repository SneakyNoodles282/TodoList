const express = require('express');
const router = express.Router();
const { getTodos } = require("../lib/db")
const ObjectID = require('mongodb').ObjectID

router.post('/list/new', async (req, res) => {
    const db = getTodos()
    const newList = {
        name: req.body.name,
        userID: req.user._id,
        items: []
    }
    if(!newList.name){
        res.status(400).json({error:"Name Is Empty"})
        return
    }
    await db.insertOne(newList)
    res.json(newList)
})

router.get('/lists', async (req, res) => {
    const db = getTodos()
    const docs = await db.find({ userID: req.user._id, }).toArray()
    res.json(docs)
});

router.delete('/list/:id', async (req, res) =>{
    const id = req.params.id;
    const db = getTodos()
    const result = await db.deleteOne({ _id : ObjectID(id), userID : req.user._id });
    if(result.deletedCount === 0){
      res.status(404).json({error:"List Doesn't Exist"})
      return
    }
    const docs = await db.find({ userID : req.user._id }).toArray()
    res.json(docs)
})

module.exports = router

/*
POST /list/new
GET /lists
DELETE /list

*/