<?php
session_start();
include 'db.php';

if(!isset($_SESSION['user'])) {
    header("Location: login.php");
}

$id = $_GET['id'];

$conn->query("DELETE FROM products WHERE id=$id");

header("Location: products.php");
?>