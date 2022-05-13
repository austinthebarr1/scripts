(async function () {
// const { exec } = require("child_process");
// exec("az monitor app-insights query --app 8b8a9c3e-1081-4134-805d-1e063f4efa00 --analytics-query 'traces" +
// "| where message contains "eventSource" and message contains "REPLAY"
// | extend eventData = indexof(message, "eventData") + 13
// | extend passengerData = indexof(message, "passengerData") - 5
// | extend len = passengerData - eventData
// | extend sub_str = parse_json(strcat(substring(message, eventData, len), "}"))
// | extend departureDate = sub_str["departureDateStnLocal"]
// | extend flightNumber = sub_str["flightNumber"]
// | extend originStation = sub_str["originStation"]
// | extend destinationStation = sub_str["destinationStation"]
// | order by timestamp desc
// ' --offset 72h > ~/repos/test2.txt")
  const buildData = (row) => {
    row.forEach((entry) => {
      if (
        typeof entry == "string" &&
        entry.includes('{"departureDateStnLocal":')
      ) {
        const data = JSON.parse(entry);
        console.log(data);
      }
    });
  };
  const findRow = (rows) => {
    rows.forEach((row) => {
      buildData(row);
    });
  };

  const raw = fs.readFileSync("test2.txt");
  const json = JSON.parse(raw);
  console.log(json);
  const rows = json["tables"][0].rows;
  findRow(rows);
})();
