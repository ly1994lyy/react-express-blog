module.exports = app => {
  const express = require("express");
  const router = express.Router();
  const Category = require('../../models/Category')
  const Article = require('../../models/Article')

  //分类增删改查
  router.post("/categories", async(req, res) => {
    const {name} = req.body
    const isValid = await Category.findOne({name})
    if(isValid){
      return res.status(422).send({
        message:'分类名称已存在！'
      })
    }
    const model = await Category.create(req.body)
    res.send(model)
  });

  router.get("/categories/:id", async(req, res) => {
    const model = await Category.findById(req.params.id)
    res.send(model)
  });

  router.get("/categories", async(req, res) => {
    const {searchWord} = req.query
    const model = await Category.find({name:new RegExp(searchWord)})
    res.send(model)
  });

  router.put("/categories/:id",async(req,res)=>{
    const model = await Category.findByIdAndUpdate(req.params.id,req.body)
    res.send(model)
  })

  router.delete("/categories/:id",async(req,res)=>{
    await Category.findByIdAndDelete(req.params.id,req.body)
    res.send({
      type:"success",
      message:"删除成功!"
    })
  })

  //文章增删改查
  router.post("/articles", async(req, res) => {
    const {title} = req.body
    const isValid = await Article.findOne({title})
    if(isValid){
      return res.status(422).send({
        message:'文章标题已存在！'
      })
    }
    const model = await Article.create(req.body)
    res.send(model)
  });

  router.get("/articles", async(req, res) => {
    const {searchWord} = req.query
    const model = await Article.find({title:new RegExp(searchWord)}).populate('categories')
    res.send(model)
  });

  router.get("/articles/:id", async(req, res) => {
    const model = await Article.findById(req.params.id)
    res.send(model)
  });

  router.put("/articles/:id",async(req,res)=>{
    const model = await Article.findByIdAndUpdate(req.params.id,req.body)
    res.send(model)
  })

  router.delete("/articles/:id",async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id,req.body)
    res.send({
      type:"success",
      message:"删除成功!"
    })
  })

  app.use("/admin/api", router);
};
