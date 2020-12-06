// const { urlencoded } = require("express")
const express = require("express")
const multer = require("multer")
const models = require("../models/index")
const transaksi = models.transaksi
const detail_transaksi = models.detail_transaksi
const app = express()

app.use(express.urlencoded({extended: true}))

// authorization
const verifyToken = require("./verifyToken")

app.get("/", verifyToken, async (req,res) => {
    // console.log(models.transaksi);
    let data = await transaksi.findAll({
        include: [
            "customer",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["product"]
            }
        ]
    })
    res.json({
        data: data
    })
})

app.get("/:id_transaksi", async (req,res) => {
    // ambil data by id
    let param = {id_transaksi: req.params.id_transaksi}
    let data = await transaksi.findOne({
        where: param,
        include: [
            "customer",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["product"]
            }
        ]
    })
    res.json({
        data: data
    })
})

app.post("/", async (req,res) => {
    // insert data
    // tampung data yg direquest
    let data = {
        id_customer: req.body.id_customer,
        waktu: req.body.waktu
    }
    console.log(data);

    // proses insert data ke table transaksi
    transaksi.create(data)
    .then(result => {
        // ambil nilai dari transaksi_id
        let id_transaksi = result.id_transaksi
        let detail = JSON.parse(req.body.detail_transaksi)
        console.log(detail);
        
        // // awal dari array detail
        // // detail = [
        // //     {"product_id": "1","qty" : "1", "price":"10000"}, // elemen 1 sisipkan transaksi_id = "5"
        // //     {"product_id": "2","qty" : "5", "price":"5000"} // elemen 2, sisipkan transaksi_id ="5"
        // // ]

        // // proses menyisipkan transaksi_id
        detail.forEach(element => {
            element.id_transaksi = id_transaksi
        });

        // // akhir dari array detail
        // // detail = [
        // //     {"transaksi_id": "5","product_id": "1","qty" : "1", "price":"10000"}, // elemen 1 sisipkan transaksi_id = "5"
        // //     {"transaksi_id": "5","product_id": "2","qty" : "5", "price":"5000"} // elemen 2, sisipkan transaksi_id ="5"
        // // ]


        // // proses insert data ke detail_transaksi
        // // create -> dibuat utk insert 1 data / row
        // // bulkCreate-> dibuat utk insert multiple data/row
        detail_transaksi.bulkCreate(detail)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
        // res.json({
        //     message: detail
        // })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.put("/", async (req,res) => {
    // update data

    // tampung data yg direquest
    let data = {
        id_customer: req.body.id_customer,
        waktu: req.body.waktu
    }

    // tampung parameter
    let param = {
        id_transaksi: req.body.id_transaksi
    }

    // proses insert data ke table transaksi
    transaksi.update(data, {where: param})
    .then(result => {

        // hapus data di detail
        detail_transaksi.destroy({where: param}).then().catch()

        // ambil nilai dari transaksi_id
        let id_transaksi = param.id_transaksi
        let detail = JSON.parse(req.body.detail_transaksi)
        
        // awal dari array detail
        // detail = [
        //     {"product_id": "1","qty" : "1", "price":"10000"}, // elemen 1 sisipkan transaksi_id = "5"
        //     {"product_id": "2","qty" : "5", "price":"5000"} // elemen 2, sisipkan transaksi_id ="5"
        // ]

        // proses menyisipkan transaksi_id
        detail.forEach(element => {
            element.id_transaksi = id_transaksi
        });

        // akhir dari array detail
        // detail = [
        //     {"transaksi_id": "5","product_id": "1","qty" : "1", "price":"10000"}, // elemen 1 sisipkan transaksi_id = "5"
        //     {"transaksi_id": "5","product_id": "2","qty" : "5", "price":"5000"} // elemen 2, sisipkan transaksi_id ="5"
        // ]

        
        // proses insert data ke detail_transaksi
        // create -> dibuat utk insert 1 data / row
        // bulkCreate-> dibuat utk insert multiple data/row
        detail_transaksi.bulkCreate(detail)
        .then(result => {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete("/:id_transaksi", async (req,res) => {
    // delete data

    // tampung id_transaksi
    let param = { id_transaksi: req.params.id_transaksi}
    try {
        // hapus detail transaksi
        await detail_transaksi.destroy({where: param})

        // hapus transaksinya
        await transaksi.destroy({where: param})

        res.json({
            message: "data has been deleted"
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

module.exports = app
