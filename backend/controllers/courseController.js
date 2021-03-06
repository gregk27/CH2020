const mongoose = require("mongoose");
const { Assessment } = require("../models/assessmentModel");
const Course = require("../models/courseModel");

exports.list_all_course_entries = function (req, res) {

    let query = {};

    if (req.query.course_code != undefined) {
        re = new RegExp(req.query.course_code, "i");
        query.course_code = re;
    } 
    if (req.query.university != undefined) {
        re = new RegExp(req.query.university, "i");
        query.university_name = re;
    }
    if (req.query.term != undefined) {
        re = new RegExp(req.query.term, "i");
        query.term = re;
    }
    console.log(query);

    Course.find(query, function (err, course) {
        if (err) res.send(err);
        console.log(course);
        res.json(course);
    });
};

function verify_course(body) {
    if (
        !body.hasOwnProperty("course_name") ||
        !body.hasOwnProperty("university_name") ||
        !body.hasOwnProperty("course_code") ||
        !body.hasOwnProperty("term") ||
        !body.hasOwnProperty("assessments")
    ) {
        return false;
    } else {
        return true;
    }
}
exports.add_course = async function (req, res) {
    if (verify_course(req.body)) {
        let course_entry = {
            course_name: req.body.course_name,
            university_name: req.body.university_name,
            course_code: req.body.course_code,
            term: req.body.term,
        };
        let new_course = new Course(course_entry);
        let course_id;

        try {
            let result = await new_course.save();
        } catch (ex) {
            console.error(ex);
        }

        assessments = req.body.assessments;
        for (let i = 0; i < assessments.length; i++) {
            assessments[i]["course"] = new_course._id;
        }
        await Assessment.insertMany(assessments);
        return res.json({ course_id: new_course._id });
    }
    return res.status(400).json({
        "Error message":
            "Improper request: Must contain course_name, university_name, course_code, term, and assessments",
    });
};

exports.list_all_courses = function (req, res) {
    Course.find({}, function (err, course) {
        if (err) res.send(err);
        res.json(course);
    });
};

exports.add_a_course = function (req, res) {
    var new_course = new Course(req.body);
    new_course.save(function (err, course) {
        if (err) res.send(err);
        res.json(course);
    });
};

exports.delete_course = function (req, res) {
    Course.remove(
        {
            _id: req.params.courseId,
        },
        function (err, course) {
            if (err) res.send(err);
            res.json({ message: "Course successfully deleted" });
        }
    );
};
