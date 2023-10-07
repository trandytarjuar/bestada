const config = require("../config/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);

pool.on("error", (err) => {
  console.error(err);
});
function payment(req, res, callback) {
  const id_bookingTocheck = req.body.pembayaran.id_booking;
  pool.getConnection(function (err, connection) {
    if (err) {
      // Handle error
      return callback(err);
    }
    const selectQuery =
      "SELECT id AS id_booking, booking_checkout_time AS checkout, id_detail_gedung AS detail_gedung FROM booking WHERE id = ?";
    connection.query(
      selectQuery,
      [id_bookingTocheck],
      function (error, results) {
        if (error) {
          connection.release(); // Release the connection in case of an error
          return callback(error);
        }
        if (results.length === 0) {
          connection.release();
          return callback(new Error("id_booking not found"));
        }
        const bookingCheckoutTime = results[0].checkout;
        const detailGedung = results[0].detail_gedung;
        const pembayaran = req.body.pembayaran;

        if (pembayaran.jam_keluar > bookingCheckoutTime) {
          const selisihJam = pembayaran.jam_keluar - bookingCheckoutTime;
          const addCost = selisihJam * 3000;
          if (isNaN(addCost)) {
            // Jika addCost bukan angka, kembalikan kesalahan
            connection.release();
            return callback(new Error("Invalid additional cost"));
          }
          const pay = {
            id_booking: results[0].id_booking,
            time_to_enter_reality: pembayaran.jam_masuk,
            reality_checkout_time: pembayaran.jam_keluar,
            additional_cost: addCost,
            tgl_keluar_real: pembayaran.tgl_keluar,
          };
          console.log("paaaaayyy", pay);

          // Update the 'pembayaran' table with the new data
          connection.query(
            `UPDATE pembayaran SET reality_checkout_time = ?, additional_cost = ? WHERE id_booking = ?`,
            [pembayaran.jam_keluar, addCost, results[0].id_booking],
            function (error, updateResults) {
              console.log("ssssss", updateResults);
              if (error) {
                connection.release();
                return callback(error);
              }
              const query_pembayaran = `SELECT id AS id_pembayaran, time_to_enter_reality AS time_checkin FROM pembayaran WHERE id_booking = ?`;
              connection.query(
                query_pembayaran,
                [results[0].id_booking],
                function (error, pay) {
                  if (error) {
                    connection.release();
                    return callback(error);
                  }
                  const id_pays = pay[0].id_pembayaran;
                  const checkin = pay[0].time_checkin;
                  const queryDetailPembayaran = `SELECT total AS total_pembayaran FROM detail_pembayaran WHERE id_pembayaran = ?`;
                  connection.query(
                    queryDetailPembayaran,
                    [id_pays],
                    function (error, detail) {
                      if (error) {
                        connection.release();
                        return callback(error);
                      }
                      const total = detail[0].total_pembayaran;
                      const totalPembayaran = total + addCost;
                      const detailPembayaran = {
                        id_pembayaran: id_pays,
                        entry_time: checkin,
                        checkout_time: pembayaran.jam_keluar,
                        total: totalPembayaran,
                      };
                      connection.query(
                        `INSERT INTO detail_pembayaran SET ?`,
                        detailPembayaran,
                        function (err) {
                          if (err) {
                            connection.release();
                            return callback(err);
                          }
                          connection.query(
                            `UPDATE detail_gedung SET status = '1' WHERE id = ?`,
                            [detailGedung],
                            function (err, updateDetailGedung) {
                              connection.release();
                              if (err) {
                                return callback(err);
                              }
                              const responseQuery = `SELECT b.booking_date, b.booking_entry_time, b.booking_checkout_time, g.building_name, sp.block_name, sp.slot_no FROM detail_pembayaran AS dp INNER JOIN pembayaran AS p ON p.id = dp.id_pembayaran INNER JOIN booking AS b ON b.id = p.id_booking INNER JOIN detail_gedung AS dg ON dg.id = b.id_detail_gedung INNER JOIN gedung AS g ON g.id = dg.id_gedung INNER JOIN slot_parkir AS sp ON sp.id = dg.id_slot WHERE p.id_booking = ? ORDER BY dp.id LIMIT 1`;
                              connection.query(
                                responseQuery,
                                [id_bookingTocheck],
                                function (err, response) {
                                  connection.release();
                                  if (err) {
                                    return callback(err);
                                  }
                                  const responseData = {
                                    message:
                                      "Booking added successfully, and status updated to 1.",
                                    data: response,
                                  };
                                  res.status(200).json(responseData);
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
            }
          );
        } else {
          connection.release();
          return callback(
            new Error("Jam keluar harus lebih besar dari waktu checkout")
          );
        }
      }
    );
  });
}

// function payment(req, res, callback) {
//   pool.getConnection(function (err, connection) {
//     if (err) {
//       // Handle error
//       return callback(err);
//     }

//     // Dapatkan data dari req
//     const pembayaran = req.body.pembayaran;
//     const detail_pembayaran = req.body.detail_pembayaran;

//     // Pemeriksaan apakah id_booking ada
//     const id_booking = pembayaran.id_booking;
//     const query =
//       "SELECT id AS id_booking, booking_checkout_time AS checkout, id_detail_gedung AS detail_gedung FROM booking WHERE id = ?";

//     connection.query(query, [id_booking], function (err, results) {
//       if (err) {
//         connection.release(); // Selalu lepaskan koneksi jika terjadi kesalahan
//         // Handle error
//         return callback(err);
//       }

//       if (results.length === 0) {
//         connection.release(); // Selalu lepaskan koneksi jika id_booking tidak ditemukan
//         // id_booking tidak ditemukan, Anda dapat menangani ini di sini
//         return callback(new Error("id_booking tidak ditemukan"));
//       }

//       // id_booking ada, Anda dapat melanjutkan dengan operasi yang Anda inginkan
//       const pay = {
//         id_booking: results[0].id_booking,
//         time_to_enter_reality: pembayaran.jam_masuk,
//         reality_checkout_time: pembayaran.jam_keluar,
//         additional_cost: pembayaran.biaya,
//         tgl_keluar_real: pembayaran.tgl_keluar,
//       };

//       // Ambil total dari tabel detail_pembayaran
//       const id_pembayaran = detail_pembayaran.id_pembayaran;
//       const totalQuery =
//         "SELECT total FROM detail_pembayaran WHERE id_pembayaran = ?";

//       connection.query(
//         totalQuery,
//         [id_pembayaran],
//         function (err, detailResults) {
//           if (err) {
//             connection.release(); // Selalu lepaskan koneksi jika terjadi kesalahan
//             // Handle error
//             return callback(err);
//           }

//           if (detailResults.length === 0) {
//             connection.release(); // Selalu lepaskan koneksi jika id_pembayaran tidak ditemukan
//             // Id_pembayaran tidak ditemukan, Anda dapat menangani ini di sini
//             return callback(new Error("Id_pembayaran tidak ditemukan"));
//           }

//           // id_pembayaran ada, Anda dapat melanjutkan dengan operasi yang Anda inginkan
//           const totalawal = detailResults[0].total;

//           // Cek apakah reality_checkout_time melebihi atau sama dengan booking_checkout_time
//           if (pay.reality_checkout_time >= results[0].checkout) {
//             // Menghitung total berdasarkan rumus yang Anda sebutkan
//             const difference = pay.reality_checkout_time - results[0].checkout;
//             pay.additional_cost += difference * 3000; // Menambahkan biaya tambahan

//             // Update data pembayaran dengan total yang diperbarui
//             const updatePaymentQuery =
//               "UPDATE pembayaran SET total = ? WHERE id_booking = ?";
//             const newTotal = totalawal + pay.additional_cost;

//             connection.query(
//               updatePaymentQuery,
//               [newTotal, pay.id_booking],
//               function (err, updatePaymentResult) {
//                 if (err) {
//                   connection.release(); // Selalu lepaskan koneksi jika terjadi kesalahan
//                   // Handle error
//                   return callback(err);
//                 }

//                 // Selanjutnya, lakukan operasi untuk memasukkan data baru ke dalam tabel detail_pembayaran
//                 const detailpayment = {
//                   id_pembayaran: id_pembayaran,
//                   entry_time: pembayaran.jam_masuk,
//                   checkout_time: pembayaran.jam_keluar,
//                   total: newTotal, // Total yang diperbarui
//                 };

//                 const insertDetailPaymentQuery =
//                   "INSERT INTO detail_pembayaran SET ?";
//                 connection.query(
//                   insertDetailPaymentQuery,
//                   detailpayment,
//                   function (err, insertDetailResult) {
//                     connection.release(); // Selalu lepaskan koneksi setelah penggunaannya

//                     if (err) {
//                       // Handle error
//                       return callback(err);
//                     }

//                     // Sekarang, Anda dapat melanjutkan dengan operasi lain yang diperlukan
//                     // Misalnya, Anda dapat mengambil data yang Anda butuhkan atau melakukan tindakan lain

//                     // ...

//                     // Handle successful insertion and retrieval here
//                     // Anda dapat mengirim respons ke client atau melakukan tindakan lain yang diperlukan
//                     const response = {
//                       message:
//                         "Booking added successfully, and payment data updated.",
//                       data: boked,
//                     };

//                     res.status(200).json(response);
//                   }
//                 );
//               }
//             );
//           } else {
//             // Jika tidak ada perubahan pada reality_checkout_time, lanjutkan dengan operasi lain
//             // Misalnya, Anda dapat mengambil data yang Anda butuhkan atau melakukan tindakan lain

//             // ...

//             // Handle successful insertion and retrieval here
//             // Anda dapat mengirim respons ke client atau melakukan tindakan lain yang diperlukan
//             const response = {
//               message: "Booking added successfully, and status updated to 1.",
//               data: boked,
//             };

//             res.status(200).json(response);
//           }
//         }
//       );
//     });
//   });
// }

module.exports.payment = payment;

function getall(req, res, callback) {
  pool.getConnection(function (err, connection) {
    if (err) return callback(err);
    connection.query(
      `SELECT b.booking_date,b.booking_entry_time,b.booking_checkout_time,p.reality_checkout_time,g.building_name,sp.block_name,sp.slot_no,dp.total,dg.status
            FROM detail_pembayaran AS dp 
            INNER JOIN pembayaran AS p ON p.id = dp.id_pembayaran 
            INNER JOIN booking as b ON b.id = p.id_booking 
            INNER JOIN detail_gedung AS dg ON dg.id = b.id_detail_gedung 
            INNER JOIN gedung AS g ON g.id = dg.id_gedung 
            INNER JOIN slot_parkir AS sp ON sp.id = dg.id_slot`,
      function (error, results) {
        connection.release();
        if (error) {
          return callback(error);
        }
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

function getById(req, res, callback) {
  let id = req.params.id;
  console.log("tesss", id);
  pool.getConnection(function (err, connection) {
    if (err) return callback(err);
    connection.query(
      `select b.booking_date,
            g.building_name,
            sp.block_name,
            sp.slot_no,
            b.booking_entry_time,
            b.booking_checkout_time,
            p.reality_checkout_time,
            p.additional_cost,
            dp.total
    from detail_pembayaran dp 
    inner join pembayaran p on p.id = dp.id_pembayaran 
    inner join booking b on b.id = p.id_booking 
    inner join detail_gedung dg on dg.id =b.id_detail_gedung 
    inner join gedung g on g.id = dg.id_gedung 
    inner join slot_parkir sp on sp.id = dg.id_slot 
    where dp.id = ?`,
      [id],
      function (error, results) {
        connection.release();
        if (error) {
          return callback(error);
        }
        return callback({
          success: true,
          message: "Berhasil Mengambil Data detail Payment",
          data: results,
        });
      }
    );
  });
}

module.exports.getById = getById;
