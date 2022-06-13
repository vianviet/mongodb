const express = require("express");
const db = require("mongoose");
const { connectDB } = require("./db");
require("dotenv").config();

const Person = db.model(
  "Person",
  new db.Schema({ name: String, blance: Number }),
  "Person"
);

let session = null;
const main = async () => {
  await connectDB();
  const app = express();
  app.use(express.json());
  //   app.get("/", (req, res) => {
  //     transfer(req, res);
  //   });

  //   await Person.createCollection()
  //     .then(() => db.startSession())
  //     .then((_session) => {
  //       session = _session;
  //       session.startTransaction();
  //       return Person.insertMany(
  //         [
  //           { name: "A", blance: 50 },
  //           { name: "B", blance: 50 },
  //         ],
  //         { session: session }
  //       );
  //     })
  //     .then((result) => {
  //       // if (result.length >= 2) {
  //       //   throw new Error("rollback");
  //       // }
  //       console.log(`add new ${result.length} person`);
  //     })
  //     .then(() =>
  //       Person.aggregate([
  //         {
  //           $group: {
  //             _id: {
  //               month: { $month: "$createdAt" },
  //               year: { $year: "$createdAt" },
  //             },
  //             count: { $sum: 1 },
  //           },
  //         },
  //         { $sort: { count: -1, "_id.year": -1, "_id.month": -1 } },
  //       ]).session(session)
  //     )
  //     .then(() => session.commitTransaction())
  //     .then(() => session.endSession())
  //     .catch((err) => {
  //       console.log(err);
  //       session.abortTransaction();
  //     });

  await transfer("A", "B", 50);

  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
  });
};
async function transfer(from, to, amount) {
  try {
    const _session = await db.startSession();
    session = _session;
    session.startTransaction();
    const opts = { session, new: true, upsert: false, remove: {}, fields: {} };
    const A = await Person.findOneAndUpdate(
      { name: from },
      { $inc: { blance: -amount } },
      opts
    );
    console.log("A", A);
    if (A.blance < 0) {
      throw new Error("Khong du tien");
    }
    const B = await Person.findOneAndUpdate(
      { name: to },
      { $inc: { blance: amount } },
      opts
    );
    console.log("B", B);
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.log(error);
    session.abortTransaction();
  }
}

main();
