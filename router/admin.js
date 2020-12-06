const express = require("express")
// const { contained } = require("sequelize/types/lib/operators")
// call model for admin
const admin = require("../models/index").admin
const app = express()
const md5 = require("md5")

app.use(express.urlencoded({extended:true}))

app.get("/", async(req, res) => {
    admin.findAll()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", async(req, res) => {
    // tampung data yang akan dimasukkan
    let data = {
        nama_admin: req.body.nama_admin,
        username: req.body.username,
        password: md5(req.body.password),
    }

    //execute insert data
    admin.create(data)
    .then(result => {
        res.json({
            message: "Data has been inserted",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.put("/", async(req, res) => {
    //tampung data request yang akan diubah
    let data = {
        nama_admin: req.body.nama_admin,
        username: req.body.username,
        password: md5(req.body.password),
    }

    // key yang menunjukan data yg akan diubah
    let param = {
        id_admin: req.body.id_admin
    }

    //execute updated data
    admin.update(data,{where : param})
    .then(result => {
        res.json({
            message: "Data has been updated",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete("/:id_admin", async(req, res) => {
    let id_admin = req.params.id_admin
    let parameter = {
        id_admin: id_admin
    }

    // execute delete data
    admin.destroy({where : parameter})
    .then(result => {
        res.json({
            message: "Data has been destroyed",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

module.exports = app