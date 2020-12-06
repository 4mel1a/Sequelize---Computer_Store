const express = require("express")
// call model for customer
const customer = require("../models/index").customer
const app = express()

// library untuk upload file
const multer = require("multer")
const path = require("path")
const fs = require("fs")
// const { pathToFileURL } = require("url")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./customer_image")
    },
    filename: (req, file, cb) => {
        cb(null, "customer_image-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})
// ------------------------------------------
app.use(express.urlencoded({extended:true}))

app.get("/", async(req, res) => {
    customer.findAll()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", upload.single("customer_image"), async(req, res) => {
    // tampung data yang akan dimasukkan
    let data = {
        nama: req.body.nama,
        phone: req.body.phone,
        alamat: req.body.alamat,
        customer_image: req.file.filename
    }

    //execute insert data
    customer.create(data)
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

app.put("/", upload.single("customer_image"), async(req, res) => {
    //tampung data request yang akan diubah
    let data = {
        nama: req.body.nama,
        phone: req.body.phone,
        alamat: req.body.alamat,
        customer_image: req.file.filename
    }

    // key yang menunjukan data yg akan diubah
    let param = {
        id_customer: req.body.id_customer
    }

    if(req.file) {
        let oldCustomer = await customer.findOne({where: param})
        let oldImage = oldCustomer.customer_image

        // delete old file
        let pathFile = path.join(__dirname, "../customer_image", oldImage)
        // __dirname = path direktori pada file saat ini
        fs.unlink(pathFile, error => console.log(error))

        data.customer_image = req.file.filename
    }

    //execute updated data
    customer.update(data,{where : param})
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

app.delete("/:id_customer", async(req, res) => {
    let id_customer = req.params.id_customer
    let parameter = {
        id_customer: id_customer
    }

    // ambil data yang akan dihapus
    let oldCustomer = await customer.findOne({where: parameter})
    let oldImage = oldCustomer.customer_image

    let pathFile = path.join(__dirname, "../customer_image", oldImage)
    // unlink --> menghapus file
    fs.unlink(pathFile, error => console.log(error))

    // execute delete data
    customer.destroy({where : parameter})
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