const { json } = require("express");
const Person = require("../models/PersonModel");
exports.createPerson = async (req, res) => {
  try {
    //   const newPerson = new Person({ name: "newperson", age: 45 });
    //   newPerson.save();
    const newperson = await Person.create(req.body);

    res.status(201).json({
      status: "success",
      data: { newperson },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
    console.log(err);
    console.log(req.body);
  }
};

exports.getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find();

    res.status(200).json({
      status: "success",
      results: persons.length,
      data: { persons },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
    console.log(err);
  }
};

exports.getPerson = async (req, res) => {
  try {
    // const person = await Person.findById(req.params.id);

    const person = await Person.findOne({
      _id: req.params.id,
    });
    res.status(200).json({
      status: "success",
      data: { person },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
    console.log(err);
  }
};

exports.updataPerson = async (req, res) => {
  try {
    // const person = await Person.updateOne(
    //   {
    //     _id: req.params.id,
    //     // name: "zj",
    //   },
    //   req.body
    // );

    const person = await Person.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: "success",
      data: { person },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
    console.log(err);
  }
};

exports.deletePerson = async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: { person },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
    console.log(err);
  }
};

exports.queryPersons = async (req, res) => {
  try {
    //fillter1
    // console.log(req.query);
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });

    //filter2
    queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    console.log(queryStr);
    // //查询
    // const persons = await Person.find(queryObj);

    //build query
    let query = Person.find(JSON.parse(queryStr));

    //sort
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    }

    //分页
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numPersons = await Person.countDocuments();
      if (skip > numPersons) {
        throw new Error("page not exist");
      }
    }

    //exec query
    const persons = await query;

    res.status(200).json({
      status: "success",
      persons,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
    console.log(err);
  }
};
