<?php
session_start();
include 'db.php';

if(!isset($_SESSION['user'])) {
    header("Location: login.php");
}

$id = $_POST['id'];
$name = $_POST['name'];
$price = $_POST['price'];
$quantity = $_POST['quantity'];

$conn->query("UPDATE products 
              SET name='$name', price='$price', quantity='$quantity' 
              WHERE id=$id");

header("Location: products.php");
?>