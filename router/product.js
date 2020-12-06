const express = require("express")
// call model for product
const product = require("../models/index").product
const app = express()

// library untuk upload file
const multer = require("multer")
const path = require("path")
const fs = require("fs")
// const { pathToFileURL } = require("url")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./product_image")
    },
    filename: (req, file, cb) => {
        cb(null, "product_image-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})
// ------------------------------------------
app.use(express.urlencoded({extended:true}))

app.get("/", async(req, res) => {
    product.findAll()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", upload.single("product_image"), async(req, res) => {
    // tampung data yang akan dimasukkan
    let data = {
        nama: req.body.nama,
        price: req.body.price,
        stok: req.body.stok,
        product_image: req.file.filename
    }

    //execute insert data
    product.create(data)
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

app.put("/", upload.single("product_image"), async(req, res) => {
    //tampung data request yang akan diubah
    let data = {
        nama: req.body.nama,
        price: req.body.price,
        stok: req.body.stok,
        product_image: req.file.filename
    }

    // key yang menunjukan data yg akan diubah
    let param = {
        id_product: req.body.id_product
    }

    if(req.file) {
        let oldProduct = await product.findOne({where: param})
        let oldImage = oldProduct.product_image

        // delete old file
        let pathFile = path.join(__dirname, "../product_image", oldImage)
        // __dirname = path direktori pada file saat ini
        fs.unlink(pathFile, error => console.log(error))

        data.product_image = req.file.filename
    }

    //execute updated data
    product.update(data,{where : param})
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

app.delete("/:id_product", async(req, res) => {
    let id_product = req.params.id_product
    let parameter = {
        id_product: id_product
    }

    // ambil data yang akan dihapus
    let oldProduct = await product.findOne({where: parameter})
    let oldImage = oldProduct.product_image

    let pathFile = path.join(__dirname, "../product_image", oldImage)
    // unlink --> menghapus file
    fs.unlink(pathFile, error => console.log(error))

    // execute delete data
    product.destroy({where : parameter})
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