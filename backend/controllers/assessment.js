const { Assessment } = require("../models/assessment");
const getSyllabus = require("../services/syllabusService");

exports.getAllAssessments = function (req, res) {
    Assessment.find({}, function (err, task) {
        if (err) res.send(err);
        res.json(task);
    });
};

exports.getPDFAssessment = async function (req, res) {
    const assessments = await getSyllabus(
        "../pdfs/" + req.params.fileName + ".pdf",
        req.params.fileName
    );
    res.json(assessments);
};

exports.addAssessment = function (req, res) {
    const assessment = new Assessment({
        item: req.body.item,
        date: req.body.date,
        weight: req.body.weight,
        course: req.body.course,
    });
    assessment.save(function (err, task) {
        if (err) res.send(err);
        res.json(task);
    });
};
