const config = require("../config/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => {
  console.error(err);
});

function checkslot(req, res, callback) {
  pool.getConnection(function (err, connection) {
    if (err) return callback(err);
    connection.query(
        "SELECT COUNT(*) AS slot_digunakan FROM detail_gedung WHERE `status` = '1';",
        function(error,slotDigunakanResult){
            if(error){
                connection.release();
                return callback(error)
            }
            connection.query(
                "select jumlah_slot as totalresult from detail_gedung",
                function(error,slotKosong){
                    if(error){
                        connection.release();
                        return callback(error)
                    }
                    connection.query(
                        "SELECT g.building_name,sp.block_name,sp.slot_no FROM detail_gedung as dg INNER JOIN gedung as g ON g.id=dg.id_gedung LEFT JOIN slot_parkir  sp ON sp.id = dg.id_slot WHERE dg.`status`='0';",
                        function (error,results){
                            connection.release();
                            if(error){
                                return callback();
                            }
                            // var jumlahSlotKosong;
                            // if(jumlahSlotKosong == null){
                            //     jumlahSlotKosong = 0
                            // }else{
                             
                            // }
                            const totalSlot = slotKosong[0].totalresult;
                            
                            const slotDigunakan = slotDigunakanResult[0].slot_digunakan;
                            const jumlahSlotKosong = totalSlot - slotDigunakan;
                            return callback({
                                success:true,
                                message:"Successfully retrieved parking slot data",
                                total_slots: totalSlot,
                                slot_used: slotDigunakan,
                                empty_slot: jumlahSlotKosong,
                                data:results
                            })
                        }
                    )
                })
            
        }
    )
  });
}
module.exports.checkslot = checkslot;

