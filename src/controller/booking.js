const config = require("../config/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => {
  console.error(err);
});

function addBooking(req, res, callback) {
  const bookingData = {
    id_user: req.body.booking.user,
    id_detail_gedung: req.body.booking.id_detail_gedung,
    booking_entry_time: req.body.booking.jam_masuk,
    booking_checkout_time: req.body.booking.jam_keluar,
    booking_date: req.body.booking.tgl_booking,
  };

  const cost = 3000;
  const jam =
    parseFloat(bookingData.booking_checkout_time) -
    parseFloat(bookingData.booking_entry_time);
  const totalawal = cost * jam;

  // Assuming you have already created a connection pool named "pool"
  pool.getConnection(function (err, connection) {
    if (err) {
      return callback(err);
    }

    // Insert booking data into the 'booking' table
    connection.query(
      "INSERT INTO booking SET ?",
      bookingData,
      function (err, booking) {
        if (err) {
          connection.release(); // Release the connection in case of an error
          return callback(err);
        }

        const pay = {
          id_booking: booking.insertId, // Use result.insertId to get the last inserted ID
          time_to_enter_reality: req.body.pembayaran.jam_masuk,
          reality_checkout_time: req.body.pembayaran.jam_keluar,
          additional_cost: req.body.pembayaran.biaya,
          tgl_keluar_real: req.body.pembayaran.tgl_keluar,
        };

        connection.query(
          "INSERT INTO pembayaran SET ?",
          pay,
          function (err, payResult) {
            if (err) {
              connection.release(); // Release the connection in case of an error
              return callback(err);
            }

            const detailpayment = {
              id_pembayaran: payResult.insertId,
              entry_time: req.body.detail_pembayaran.jam_masuk,
              checkout_time: req.body.detail_pembayaran.jam_keluar,
              total: totalawal,
            };

            connection.query(
              "INSERT INTO detail_pembayaran SET ?",
              detailpayment,
              function (err) {
                if (err) {
                  connection.release(); // Release the connection in case of an error
                  return callback(err);
                }

                const detailGedungId = req.body.booking.id_detail_gedung;

                connection.query(
                  `UPDATE detail_gedung SET status = '1' WHERE id_slot = ?`,
                  [detailGedungId],
                  function (err, result) {
                    if (err) {
                      connection.release(); // Release the connection in case of an error
                      return callback(err);
                    }

                    // Retrieve booking details after the insertion
                    const bookingId = booking.insertId;
                    connection.query(
                      `SELECT b.booking_date,b.booking_entry_time,b.booking_checkout_time,g.building_name,sp.block_name,sp.slot_no FROM detail_pembayaran AS dp INNER JOIN pembayaran AS p ON p.id = dp.id_pembayaran INNER JOIN booking as b ON b.id = p.id_booking INNER JOIN detail_gedung AS dg ON dg.id = b.id_detail_gedung INNER JOIN gedung AS g ON g.id = dg.id_gedung INNER JOIN slot_parkir AS sp ON sp.id = dg.id_slot
                        WHERE p.id_booking = ?`,
                      [bookingId],
                      function (err, boked) {
                        connection.release(); // Release the connection
                        console.log("boookkk", boked);
                        if (err) {
                          return callback(err);
                        }

                        // Handle successful insertion and retrieval here
                        // You can send a response to the client or perform any other actions
                        const response = {
                          message:
                            "Booking added successfully, and status updated to 1.",
                          data: boked,
                        };

                        res.status(200).json(response);
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
}

module.exports.addBooking = addBooking;

function getall(req, res, callback) {
  pool.getConnection(function (err, connection) {
    if (err) return callback(err);
    connection.query(
      "SELECT mu.name,g.building_name,b.booking_entry_time,b.booking_checkout_time,b.booking_date FROM booking b INNER JOIN detail_gedung dg on dg.id= b.id_detail_gedung INNER JOIN master_user mu on mu.id = b.id_user INNER join gedung g on g.id = dg.id_gedung",
      function (error, results) {
        connection.release();
        if (error) {
          return callback();
        }

        // const jumlahSlotKosong = totalSlot - slotDigunakan;
        return callback({
          success: true,
          message: "Berhasil Mengambil Data Booking",
          data: results,
        });
      }
    );
  });
}
module.exports.getall = getall;
