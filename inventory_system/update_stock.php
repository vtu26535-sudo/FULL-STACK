<?php
include 'config.php';

$id = $_GET['id'];

if($_SERVER["REQUEST_METHOD"] == "POST"){

    $qty  = $_POST['quantity'];
    $type = $_POST['type'];

    if($type == "IN"){
        $conn->query("UPDATE products SET quantity = quantity + $qty WHERE id=$id");
    } else {
        $conn->query("UPDATE products SET quantity = quantity - $qty WHERE id=$id");
    }

    $conn->query("INSERT INTO stock_transactions (product_id, transaction_type, quantity)
                  VALUES ($id, '$type', $qty)");

    header("Location: index.php");
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Update Stock</title>
</head>
<body>

<h2>Update Stock</h2>

<form method="POST">
    <input type="number" name="quantity" placeholder="Quantity" required>

    <select name="type">
        <option value="IN">Stock In</option>
        <option value="OUT">Stock Out</option>
    </select>

    <button type="submit">Update</button>
</form>

</body>
</html>