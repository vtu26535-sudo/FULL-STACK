<?php
// Database connection
$conn = new mysqli("127.0.0.1", "root", "", "student_db", 3307);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Insert data
if(isset($_POST['submit'])){
    $name = $_POST['name'];
    $email = $_POST['email'];
    $dob = $_POST['dob'];
    $department = $_POST['department'];
    $phone = $_POST['phone'];

    $sql = "INSERT INTO students (name, email, dob, department, phone)
            VALUES ('$name','$email','$dob','$department','$phone')";
    $conn->query($sql);
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Student Registration</title>
<style>
body {
    font-family: Arial;
    background: #f2f2f2;
    padding: 20px;
}
.container {
    width: 500px;
    margin: auto;
    background: white;
    padding: 20px;
}
input, select {
    width: 100%;
    padding: 8px;
    margin: 8px 0;
}
button {
    padding: 10px;
    width: 100%;
    background: green;
    color: white;
    border: none;
}
table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
}
table, th, td {
    border: 1px solid black;
}
th, td {
    padding: 8px;
    text-align: center;
}
</style>
</head>
<body>

<div class="container">
<h2>Student Registration Form</h2>

<form method="POST">
    <input type="text" name="name" placeholder="Full Name" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="date" name="dob" required>

    <select name="department" required>
        <option value="">Select Department</option>
        <option>CSE</option>
        <option>ECE</option>
        <option>EEE</option>
        <option>MECH</option>
    </select>

    <input type="text" name="phone" placeholder="Phone Number" required>

    <button type="submit" name="submit">Register</button>
</form>

<h2>Registered Students</h2>

<table>
<tr>
    <th>ID</th>
    <th>Name</th>
    <th>Email</th>
    <th>DOB</th>
    <th>Department</th>
    <th>Phone</th>
</tr>

<?php
$result = $conn->query("SELECT * FROM students");
while($row = $result->fetch_assoc()){
    echo "<tr>
            <td>".$row['id']."</td>
            <td>".$row['name']."</td>
            <td>".$row['email']."</td>
            <td>".$row['dob']."</td>
            <td>".$row['department']."</td>
            <td>".$row['phone']."</td>
          </tr>";
}
?>
</table>

</div>
</body>
</html>