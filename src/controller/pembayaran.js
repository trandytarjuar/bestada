const config = require("../config/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => {
  console.error(err);
});

function payment(req,res,callback){
    let pay = {
        id_booking: req.body.id_booking,
        jam_masuk_real : req.body.jam_masuk,
        jam_keluar_real:req.body.jam_keluar,
        biaya_tambahan: req.body.biaya,
        tgl_keluar_real: req.body.tgl_keluar
    }

    pool.getConnection(function (err,connection){
        if(err){
            return callback(err)
        }
        connection.query(
            "INSERT INTO pembayaran SET ?",
            pay,
            function(err,payment){
                connection.release();
                if(err){
                    return callback(err);
                }
                res
                .status(200)
                .json({
                  message: "Booking added successfully, and status updated to 1.",
                });
            }
        )
    })
}