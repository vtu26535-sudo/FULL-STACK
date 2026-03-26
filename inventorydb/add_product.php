<?php
include 'db.php';

$name = $_POST['name'];
$price = $_POST['price'];
$quantity = $_POST['quantity'];

$sql = "INSERT INTO products (name, price, quantity)
        VALUES ('$name', '$price', '$quantity')";

$conn->query($sql);

echo "Product Added!";
?>