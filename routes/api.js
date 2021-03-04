const express = require('express');
const router = express.Router();
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const User = require('../models/User');
var mongoose = require('mongoose');
const Log = require('../models/Log');

router.post('/addChildToParent', (req, res) => {
    var r = new Parent();

    r.first_name = 'Vian';
    r.last_name = 'Parinte';
    r.cnp = '132465'
    r.children.push('603cb92a8f1f90e7e9e81f12');

    r.save((error) => {
        if (error) {
            res.status(500).json({ msg: 'Sorry, internal server errors' });
            return;
        }
        return res.json({
            msg: 'Your data has been saved!!!!!!'
        });
    });
});


router.get('/name', (req, res) => {
    const data = {
        data: 'test'
    };
    res.json(data);
});

router.get('/login', (req, res) => {
    let username = req.query.username;
    let password = req.query.password;
    password = require('crypto').createHash('md5').update(password).digest("hex")
    User.find().where('email').equals(username).where('password').equals(password).then((data) => {
        console.log(data)
        res.json(data)
    })
})

router.post('/getUser/', function (req, res) {
    let user = req.body.user;
    User.findById(user._id).then((data) => {
        res.json(data)
    })
})

router.get('/getParent/', function (req, res) {
    let parentID = req.query.parentID;
    Parent.findById(parentID).then((data) => {
        // console.log(parentID, data)
        res.json(data)
    })
})

router.get('/parents/', function (req, res) {
    console.log(req.query.userID)
    Parent.find().populate({
        path: 'user',
        match: { id: req.query.userID }
    }).then((data) => {
        res.json(data)
    })
})

router.post('/parents/add', function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const cnp = req.body.cnp;
    const address = req.body.address;
    const city = req.body.city;
    const phone = req.body.phone;
    console.log(req.body.user._id)

    var parent = new Parent();
    parent.first_name = firstName
    parent.last_name = lastName
    parent.cnp = cnp
    parent.address = address
    parent.city = city
    parent.phone = phone
    parent.user = req.body.user._id
    parent.save((error) => {
        if (error) {
            console.log(error)
            res.status(500).json({ msg: 'Sorry, internal server errors' });
            return;
        }
        return res.json({
            msg: 'Parent saved!'
        });
    });
})

router.post('/parents/delete', function (req, res) {
    const parent = req.body.parent;

    Parent.deleteOne({ _id: parent._id }, function (err) {
        if (err) {
            console.log(err);
            res.status(400).json(error);
        }
        else
            res.json("Parent deleted!")
    });

})

router.get('/students/', function (req, res) {
    Student.find().populate({
        path: 'user',
        match: { id: req.query.userID }
    }).then((data) => {
        res.json(data)
    })
})

router.post('/students/add', function (req, res) {
    var student = new Student();
    student.first_name = req.body.firstName
    student.last_name = req.body.lastName
    student.user = req.body.userID
    student.parent = req.body.parentID
    student.save((error) => {
        if (error) {
            console.log(error)
            res.status(500).json({ msg: 'Sorry, internal server errors' });
            return;
        }
        return res.json({
            msg: 'Student saved!'
        });
    });
})

router.post('/students/delete', function (req, res) {
    const student = req.body.student;
    console.log(student)
    Log.deleteMany({student_id: student._id}, function (err) {
        if (err) {
            console.log(err);
            res.status(400).json(error);
        }
        else
            console.log('Logs deleted!')
    })

    Student.deleteOne({ _id: student._id }, function (err) {
        if (err) {
            console.log(err);
            res.status(400).json(error);
        }
        else
            res.json("Student deleted!")
    });
})

router.get('/logs/', function (req, res) {
    let userID = req.query.userID;
    let date = req.query.date;
    var students = []
    let day = req.query.day
    let month = req.query.month
    let year = req.query.year

    // Student.find({ 'user': { _id: userID } }).then((data) => {
    //     students = data
    //     var allLogs = []
    //     for (const student of students) {
    //         // console.log(student)

    Log.find({ 'user_id': { _id: userID }, date: new Date(year, month - 1, day) }).then((data) => {
        console.log(data)
        res.json(data)
    })
    // }

})


// connection.query(`SELECT students.id as studentID, first_name, last_name, students.user_id, parent_id, log.id as logID, log.date FROM students LEFT JOIN log ON student_id = students.id WHERE students.user_id = ${userID} and log.date = STR_TO_DATE('${date}', '%d/%m/%Y')`, function (error, rows, fields) {
//     if (!!error) {
//         res.status(400).json(error);
//     }
//     else {
//         res.json(rows)
//     }
// })


router.post('/log', function (req, res) {
    const studentID = req.body.studentID;
    const date = req.body.date;
    const userID = req.body.userID;
    console.log(studentID, date, userID)
    var log = new Log();
    log.student_id = studentID
    log.user_id = userID
    log.date = date
    log.save((error) => {
        if (error) {
            console.log(error)
            res.status(500).json({ msg: 'Sorry, internal server errors' });
            return;
        }
        return res.json({
            msg: 'Log saved!'
        });
    });
})

router.get('/logsForStudent/', function (req, res) {
    let studentID = mongoose.Types.ObjectId(req.query.studentID)
    let startDate = req.query.startDate
    let endDate = req.query.endDate

    console.log(startDate, endDate)
    Log.aggregate([
        {
            $match: {
                'student_id': studentID,
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                // logs: { $dateToString: { format: "%Y-%m", date: "$date" } },
                logs: { $sum: 1 }
            }
        }
    ],

        function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        }
    );
})
router.get('/testLogs', function (req, res) {
    let studentID = mongoose.Types.ObjectId(req.query.studentID)
    let startDate = req.query.startDate
    let endDate = req.query.endDate

    console.log(studentID)
    Log.aggregate([
        {
            $match: {
                'student_id': studentID,
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                // logs: { $dateToString: { format: "%Y-%m", date: "$date" } },
                logs: { $sum: 1 }
            }
        }
    ],

        function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        }
    );
})

router.post('/updateBillNumber/', function (req, res) {
    let user = req.body.user;
    let billNumber = req.body.billNumber
    // console.log(req.body)
    User.findById(user._id).then((data) => {
        data.bill_number = billNumber
        data.save((error) => {
            if (error) {
                res.status(500).json({ msg: 'Sorry, internal server errors' });
                return;
            }
            console.log('Bill Number updated!')
        });
    })
    User.findById(user._id).then((data) => { res.json(data) })
    // connection.query(`UPDATE users SET bill_number = ${billNumber} WHERE users.id = ${user.id}`, function (error, rows, fields) {
    //     if (!!error) {
    //         res.status(400).json(error);
    //         console.log(error)
    //     }
    //     else {
    //         // var existingBillNo = rows.length
    //     }
    // })

    // connection.query(`SELECT * FROM users WHERE users.id = ${user.id}`, function (error, rows, fields) {
    //     if (!!error) {
    //         res.status(400).json(error);
    //         console.log(error)
    //     }
    //     else {
    //         res.json(rows)
    //     }
    // })
})
module.exports = router;