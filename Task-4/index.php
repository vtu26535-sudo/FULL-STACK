<?php
$conn = new mysqli("localhost", "root", "", "order_management");

if ($conn->connect_error) {
    die("Connection failed");
}

$orderQuery = "
SELECT c.name, p.product_name, p.price, o.quantity,
       (p.price * o.quantity) AS total_amount,
       o.order_date
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN products p ON o.product_id = p.product_id
ORDER BY o.order_date DESC
";

$orderResult = $conn->query($orderQuery);

$highestQuery = "
SELECT MAX(p.price * o.quantity) AS highest_order
FROM orders o
JOIN products p ON o.product_id = p.product_id
";

$highestResult = $conn->query($highestQuery);
$highest = $highestResult->fetch_assoc();

$activeQuery = "
SELECT name FROM customers
WHERE customer_id = (
    SELECT customer_id
    FROM orders
    GROUP BY customer_id
    ORDER BY COUNT(order_id) DESC
    LIMIT 1
)";
$activeResult = $conn->query($activeQuery);
$active = $activeResult->fetch_assoc();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Order Management</title>
    <style>
        body { font-family: Arial; background:#f4f4f4; padding:20px; }
        h2 { text-align:center; }
        .summary { display:flex; justify-content:space-around; margin-bottom:20px; }
        .box { background:white; padding:15px; border-radius:8px; width:40%; text-align:center; box-shadow:0 3px 8px rgba(0,0,0,0.1); }
        table { width:100%; border-collapse:collapse; background:white; }
        th, td { padding:10px; border:1px solid #ccc; text-align:center; }
        th { background:#007bff; color:white; }
    </style>
</head>
<body>

<h2>Order Management Dashboard</h2>

<div class="summary">
    <div class="box">
        <h3>Highest Order Value</h3>
        <p>₹ <?= $highest['highest_order']; ?></p>
    </div>

    <div class="box">
        <h3>Most Active Customer</h3>
        <p><?= $active['name']; ?></p>
    </div>
</div>

<table>
<tr>
    <th>Customer</th>
    <th>Product</th>
    <th>Price</th>
    <th>Quantity</th>
    <th>Total</th>
    <th>Date</th>
</tr>

<?php while($row = $orderResult->fetch_assoc()) { ?>
<tr>
    <td><?= $row['name']; ?></td>
    <td><?= $row['product_name']; ?></td>
    <td><?= $row['price']; ?></td>
    <td><?= $row['quantity']; ?></td>
    <td><?= $row['total_amount']; ?></td>
    <td><?= $row['order_date']; ?></td>
</tr>
<?php } ?>

</table>

</body>
</html>