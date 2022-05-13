const fs = require("fs");

const nodemailer = require("nodemailer");
async function main() {
  const transporter = nodemailer.createTransport({
    host: "outbound.alaskaair.com",
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });

  var message = {
    from: "austin.barr@alaskaair.com",
    to: "austinbarr@protonmial.com",
    subject: "test",
    text: "URL: ",
  };

  // send mail with defined transport object
   transporter.sendMail(message, function (error, info) {
    if (error) {
      console.log('Failure sending mail. Error: ' + error);
    } else {
      console.log('Mail sent: ' + info.response);
    }
  });

  // console.log("Message sent: %s", info.messageId);
  // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

main().catch(e => console.log(e));

// const buildData = (row) => {
//   row.forEach((entry) => {
//     if (
//       typeof entry == "string" &&
//       entry.includes('{"departureDateStnLocal":')
//     ) {
//       const data = JSON.parse(entry);
//       console.log(data);
//     }
//   });
// };
// const findRow = (rows) => {
//   rows.forEach((row) => {
//     buildData(row);
//   });
// };

// const raw = fs.readFileSync("test2.txt");
// const json = JSON.parse(raw);
// console.log(json);
// const rows = json["tables"][0].rows;
// findRow(rows);
