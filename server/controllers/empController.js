const mySql = require("mysql");

//Mysql
const condb = mySql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Aadharv17@#',
    database: 'aivagam',
    multipleStatements: true
});

exports.view = function (req, res) {
    //check database
    condb.getConnection((err, connection) => {
        if (err) throw err;
        connection.query("SELECT * FROM topgrep", (err, rows) => {
            connection.release(); //closing the connection
            if (!err) {
                res.render("layouts/home", { rows });
            } else {
                console.log("Error is: " + err);
            }
        });
    });
};

exports.addemp = (req, res) => {
    res.render("addemp");
};

exports.save = (req, res) => {
    condb.getConnection((err, connection) => {
        if (err) throw err;

        const { emp_name, dept, email_id, salary, phone_no } = req.body;

        // Check for deleted emp_id to reuse
        connection.query("SELECT emp_id FROM deleted_ids ORDER BY emp_id LIMIT 1", (err, result) => {
            if (err) throw err;

            let query, values;

            if (result.length > 0) {
                // Reuse the deleted emp_id
                const emp_id_to_reuse = result[0].emp_id;
                query = "INSERT INTO topgrep (emp_id, emp_name, dept, email_id, salary, phone_no) VALUES(?,?,?,?,?,?)";
                values = [emp_id_to_reuse, emp_name, dept, email_id, salary, phone_no];

                // Remove reused emp_id from deleted_ids
                connection.query("DELETE FROM deleted_ids WHERE emp_id = ?", [emp_id_to_reuse], (err) => {
                    if (err) console.log("Error removing emp_id from deleted_ids: " + err);
                });
            } else {
                // No deleted emp_id, proceed with auto-increment
                query = "INSERT INTO topgrep (emp_name, dept, email_id, salary, phone_no) VALUES(?,?,?,?,?)";
                values = [emp_name, dept, email_id, salary, phone_no];
            }

            // Insert into topgrep table
            connection.query(query, values, (err, rows) => {
                connection.release(); //closing the connection
                if (!err) {
                    res.render("addemp", { message: "Details Added Successfully!" });
                } else {
                    console.log("Error is: " + err);
                }
            });
        });
    });
};

// Modified delete function to store deleted emp_id in deleted_ids
exports.delete = (req, res) => {
    condb.getConnection((err, connection) => {
        if (err) throw err;

        let id = req.params.id;

        // Store the emp_id in deleted_ids before deleting from topgrep
        connection.query("INSERT INTO deleted_ids (emp_id) VALUES(?)", [id], (err) => {
            if (err) throw err;

            // Now delete the employee from topgrep
            connection.query("DELETE FROM topgrep WHERE emp_id = ?", [id], (err, rows) => {
                connection.release();
                if (!err) {
                    res.redirect("/");
                } else {
                    console.log("Error: " + err);
                }
            });
        });
    });
};

// No change in editemp and edit functions
exports.editemp = (req, res) => {
    condb.getConnection((err, connection) => {
        if (err) throw err;
        let id = req.params.id;
        connection.query("SELECT * FROM topgrep WHERE emp_id = ?", [id], (err, rows) => {
            connection.release(); //closing the connection
            if (!err) {
                res.render("editemp", { rows });
            } else {
                console.log("Error is: " + err);
            }
        });
    });
};

exports.edit = (req, res) => {
    condb.getConnection((err, connection) => {
        if (err) throw err;
        let id = req.params.id;

        const { emp_name, dept, email_id, salary, phone_no } = req.body;
        connection.query("UPDATE topgrep SET emp_name = ?, dept =?, email_id =?, salary =?, phone_no =? WHERE emp_id =?", [emp_name, dept, email_id, salary, phone_no, id], (err, rows) => {
            connection.release(); //closing the connection
            if (!err) {
                res.render("editemp", { message: "Details Added Successfully!" });
            } else {
                console.log("Error is: " + err);
            }
        });
    });
};
