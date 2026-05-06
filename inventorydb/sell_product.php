<?php
include 'db.php';

$product_id = $_POST['product_id'];
$quantity = $_POST['quantity'];

// Get product
$result = $conn->query("SELECT * FROM products WHERE id='$product_id'");
$row = $result->fetch_assoc();

if($row && $row['quantity'] >= $quantity) {

    $price = $row['price'];
    $total = $price * $quantity;

    // Insert sale
    $sql1 = "INSERT INTO sales (product_id, quantity_sold, total_price)
             VALUES ('$product_id', '$quantity', '$total')";

    if($conn->query($sql1) === TRUE) {

        // Update stock
        $sql2 = "UPDATE products 
                 SET quantity = quantity - $quantity 
                 WHERE id = '$product_id'";

        $conn->query($sql2);

        echo "✅ Sold Successfully!<br>";
        echo "<a href='view_products.php'>Go Back</a>";

    } else {
        echo "Error inserting sale!";
    }

} else {
    echo "❌ Invalid product or insufficient stock!";
}
?>