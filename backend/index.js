const express = require('express');
const app = express();
const config = require('./config');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const Student = require('./models/student');
const Tutor = require('./models/tutor');
const Qualification = require('./models/qualification');
const ContactMessage = require('./models/contact-message');
const Experience = require('./models/experience');
const Request = require('./models/request');

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('uploads')); //made uploads folder public 

//config multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname)
        cb(null, `${req.body.email}.jpg`)
    }
});
const upload = multer({ storage: storage })

// One-to-many DB table relationship
Tutor.belongsTo(Qualification, {
    foreignKey: 'qualification_id'
});

Tutor.belongsTo(Experience, {
    foreignKey: 'experience_id'
});

Request.belongsTo(Student, {
    foreignKey: 'student_id'
});

Request.belongsTo(Tutor, {
    foreignKey: 'tutor_id'
});

//Test database connection
config.authenticate().then(() => {
    console.log('Database is connected!');
}).catch((err) => {
    console.log(err);
});

//Routes
//Get all the students
app.get('/students', (req, res) => {
    Student.findAll().then((results) => {
        res.status(200).send(results);
    }).catch((err) => {
        console.log(err);
    });
});

//Get all the tutors
app.get('/tutors', (req, res) => {

    let data = {
        include: [Qualification, Experience]
    }

    Tutor.findAll(data).then((results) => {
        res.status(200).send(results);
    }).catch((err) => {
        console.log(err);
    });
});

//Student login
app.post('/student_login', function (req, res) {
    let emailAddress = req.body.email;
    let clearTextPassword = req.body.password;

    //Find a student using the email address
    let data = {
        where: { email: emailAddress }
    };

    Student.findOne(data).then((result) => {
        //Check if student was found in DB
        if (result) {
            // Compare clear text password to the hash value that was stored in DB
            bcrypt.compare(clearTextPassword, result.password, function (err, output) {
                if (output) {
                    res.status(200).send({ "role": "student", "name": result.name, "id": result.id });
                } else {
                    res.status(401).send('Incorrect password');
                }
            });

        } else {
            res.status(404).send('User does not exist.')
        }

    }).catch((err) => {
        res.status(500).send(err);
    });
});

//Tutor login
app.post('/tutor_login', function (req, res) {
    let emailAddress = req.body.email;
    let clearTextPassword = req.body.password;

    //Find a tutor using the email address
    let data = {
        where: { email: emailAddress }
    };

    Tutor.findOne(data).then((result) => {
        //Check if tutor was found in DB
        if (result) {
            // Compare clear text password to the hash value that was stored in DB
            bcrypt.compare(clearTextPassword, result.password, function (err, output) {
                if (output) {
                    res.status(200).send({ "role": "tutor", "name": result.name, "id": result.id });
                } else {
                    res.status(401).send('Incorrect password');
                }
            });

        } else {
            res.status(404).send('User does not exist.')
        }

    }).catch((err) => {
        res.status(500).send(err);
    });
});

//Student register
app.post('/student_register', upload.single('image'), function (req, res) {
    let clearTextPassword = req.body.password;
    let salt = 10;

    //Convert the clear text password to a hash value
    bcrypt.hash(clearTextPassword, salt, function (err, passwordHash) {
        let user_data = req.body;
        user_data.password = passwordHash; //replace clear text password with hash value

        if (req.file) {
            user_data.image = `${user_data.email}.jpg`;
        } else {
            user_data.image = 'default.jpg';
        }

        //Create student in database
        Student.create(user_data).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(err);
        });
    });
});

//Tutor register
app.post('/tutor_register', upload.single('image'), function (req, res) {
    let clearTextPassword = req.body.password;
    let salt = 10;

    //Convert the clear text password to a hash value
    bcrypt.hash(clearTextPassword, salt, function (err, passwordHash) {
        let user_data = req.body;
        user_data.password = passwordHash; //replace clear text password with hash value

        if (req.file) {
            user_data.image = `${user_data.email}.jpg`;
        } else {
            user_data.image = 'default.jpg';
        }

        //Create tutor in database
        Tutor.create(user_data).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(err);
        });
    });
});

//My students
app.get('/my_students/:tutor_id', (req, res) => {

    let data = {
        include: [Student],
        where: {
            tutor_id: req.params.tutor_id,
            status: 'accepted'
        }
    }

    Request.findAll(data).then((results) => {
        res.status(200).send(results);
    }).catch((err) => {
        console.log(err);
    });
});

//My tutors
app.get('/my_tutors/:student_id', (req, res) => {

    let data = {
        include: [
            {
                model: Tutor,
                include: [
                    { model: Qualification },
                    { model: Experience }
                ]
            }
        ],
        where: {
            student_id: req.params.student_id,
            status: 'accepted'
        }
    }

    Request.findAll(data).then((results) => {
        res.status(200).send(results);
    }).catch((err) => {
        console.log(err);
    });
});

//Student requests
app.get('/student_requests/:tutor_id', (req, res) => {

    let data = {
        include: [Student],
        where: {
            tutor_id: req.params.tutor_id,
            status: 'pending'
        }
    }

    Request.findAll(data).then((results) => {
        res.status(200).send(results);
    }).catch((err) => {
        console.log(err);
    });
});

//Tutor requests
app.get('/tutor_requests/:student_id', (req, res) => {

    let data = {
        include: [
            {
                model: Tutor,
                include: [
                    { model: Qualification },
                    { model: Experience }
                ]
            }
        ],
        where: {
            student_id: req.params.student_id,
            status: 'pending'
        }
    }

    Request.findAll(data).then((results) => {
        res.status(200).send(results);
    }).catch((err) => {
        console.log(err);
    });
});

//Filter tutors
app.get('/filter/:experience_id', (req, res) => {

    let data = {
        include: [Qualification, Experience],
        where: {
            experience_id: req.params.experience_id,
        }
    }

    Tutor.findAll(data).then((results) => {
        res.status(200).send(results);
    }).catch((err) => {
        console.log(err);
    });
});

//Send a tutor request
app.post('/tutor_requets', (req, res) => {
    let requestData = req.body;

    console.log("1: " + requestData);
    requestData.status = 'pending';
    console.log("2: " + requestData);

    //Filter the relevant row basede on the tutor_id and student_id
    let data = {
        where: {
            tutor_id: req.body.tutor_id,
            student_id: req.body.student_id
        }
    };

    // Find whether there is a record based on the studentId and tutorId
    Request.findOne(data).then((result) => {
        if (result) {

            res.status(500).send('Request already exists');

        } else {
            //Since the request doesn't exists, create it
            Request.create(requestData).then((result) => {
                res.status(200).send(result);
            }).catch((err) => {
                res.status(500).send(err);
            });
        }
    }).catch((err) => {
        res.status(500).send(err);
    });
});

//Accept or reject
app.patch('/student_requests/:tutor_id/:student_id', (req, res) => {
    let tutorId = parseInt(req.params.tutor_id);
    let studentId = parseInt(req.params.student_id);

    //Filter the relevant row basede on the tutor_id and student_id
    let data = {
        where: {
            tutor_id: tutorId,
            student_id: studentId
        }
    };

    // Find the record based on the studentId and the tutorId
    Request.findOne(data).then((result) => {
        if (result) {

            // Update status
            result.status = req.body.status;

            // Save update
            result.save().then(() => {
                res.status(200).send(result);
            }).catch((err) => {
                res.status(500).send(err);
            });

        } else {
            res.status(404).send('Record not found');
        }
    }).catch((err) => {
        res.status(500).send(err);
    });
});

//Student profile
app.get('/student_profile/:student_id', (req, res) => {

    let data = {
        where: {
            id: req.params.student_id,
        }
    }

    Student.findOne(data).then((results) => {
        res.status(200).send(results);
    }).catch((err) => {
        console.log(err);
    });
});

//Tutor profile
app.get('/tutor_profile/:tutor_id', (req, res) => {

    let data = {
        where: {
            id: req.params.tutor_id,
        },
        include: [Qualification, Experience]
    }

    Tutor.findOne(data).then((results) => {
        res.status(200).send(results);
    }).catch((err) => {
        console.log(err);
    });
});

//Tutor profile update
app.put('/tutors/:tutor_id', (req, res) => {

    let tutorId = parseInt(req.params.tutor_id);

    if (req.file) {
        req.body.image = `${req.body.email}.jpg`;
    }

    Tutor.findByPk(tutorId).then((result) => {

        if (result) {

            Object.assign(result, req.body);

            result.save().then(() => {
                res.status(200).send(result);
            });
        } else {
            res.status(404).send('Tutor not found');
        }
    }).catch((err) => {
        res.status(500).send(err);
    });
});

//Student profile update
app.put('/students/:student_id', (req, res) => {

    let studentId = parseInt(req.params.student_id);

    if (req.file) {
        req.body.image = `${req.body.email}.jpg`;
    }

    Student.findByPk(studentId).then((result) => {

        if (result) {

            Object.assign(result, req.body);

            result.save().then(() => {
                res.status(200).send(result);
            });
        } else {
            res.status(404).send('Student not found');
        }
    }).catch((err) => {
        res.status(500).send(err);
    });
});

//Delete a record on  requests table
app.delete('/requests/:student_id/:tutor_id', (req, res) => {

    let tutorId = parseInt(req.params.tutor_id);
    let studentId = parseInt(req.params.student_id);

    //Filter the relevant row basede on the tutor_id and student_id
    let data = {
        where: {
            tutor_id: tutorId,
            student_id: studentId
        }
    };

    // Find the record based on the studentId and the tutorId
    Request.findOne(data).then((result) => {
        if (result) {

            /// Delete the record
            result.destroy().then(() => {
                res.status(200).send(result);
            }).catch((err) => {
                res.status(500).send(err);
            });

        } else {
            res.status(404).send('Record not found');
        }
    }).catch((err) => {
        res.status(500).send(err);
    });
});


//Contact message
app.post('/contact_us', (req, res) => {

    //Create the message in the database
    ContactMessage.create(req.body).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

//Server
app.listen(3000, function () {
    console.log('Server running on port 3000...');
});