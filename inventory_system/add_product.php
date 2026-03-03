<?php
include 'config.php';

$name = $_POST['product_name'];
$category = $_POST['category'];
$price = $_POST['price'];

$sql = "INSERT INTO products (product_name, category, price)
        VALUES ('$name', '$category', '$price')";

$conn->query($sql);

header("Location: index.php");
?>