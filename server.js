require("dotenv").config();

const express = require("express");
const pg = require("pg");
const fs = require("fs");

const app = express();
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

const parseCSV = (data) => {
  const lines = data.split("\n");
  const headers = lines.shift().split(",");
  const objects = [];
  for (const line of lines) {
    const values = line.split(",");
    const obj = {
      name: {
        firstName: values[0],
        lastName: values[1],
      },
      age: parseInt(values[2]),
      address: {
        line1: values[3],
        line2: values[4],
        city: values[5],
        state: values[6],
      },
      additional_info: {},
    };
    for (let i = 7; i < values.length; i++) {
      const header = headers[i];
      if (header === "gender") {
        obj.additional_info[header] = values[i];
      } else {
        obj.additional_info[header] = values[i];
      }
    }
    objects.push(obj);
  }
  return objects;
};

const insertUsers = async (users) => {
  for (const user of users) {
    await client.query(
      `
      INSERT INTO users (name, age, address, additional_info)
      VALUES ($1, $2, $3, $4)`,
      [user.name, user.age, user.address, user.additional_info]
    );
  }
};

const calculateAgeDistribution = async () => {
  const result = await client.query(`
    SELECT
      CASE
        WHEN age < 20 THEN '< 20'
        WHEN age >= 20 AND age < 40 THEN '20 to 40'
        WHEN age >= 40 AND age < 60 THEN '40 to 60'
        ELSE '> 60'
      END AS age_group,
      COUNT(*) AS count
    FROM
      users
    GROUP BY
      age_group
    ORDER BY
      age_group
  `);

  const total = result.rows.reduce((acc, row) => acc + row.count, 0);
  console.log("Age-Group % Distribution");
  for (const row of result.rows) {
    const percentage = (row.count / total) * 100;
    console.log(`${row.age_group} ${percentage.toFixed(2)}`);
  }
};

app.get("/process", async (req, res) => {
  try {
    const csvData = fs.readFileSync(process.env.CSV_FILE_PATH, "utf-8");
    const users = parseCSV(csvData);
    await insertUsers(users);
    await calculateAgeDistribution();
    res.send("Data processed successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing data!");
  }
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to database");
    app.listen(3000, () => console.log("Server listening on port 3000"));
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
})();
