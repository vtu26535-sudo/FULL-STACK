<?php include 'db.php'; ?>
<html>
<head>
<link rel="stylesheet" href="style.css">
</head>
<body>

<?php include 'navbar.php'; ?>

<div class="container">
<div class="card">

<h2>Transaction History</h2>

<table>
<tr>
<th>Product</th>
<th>Unit Price</th>
<th>Quantity</th>
<th>Total</th>
<th>Date</th>
</tr>

<?php
$sql = "SELECT products.name, products.price, sales.quantity_sold, sales.total_price, sales.date 
        FROM sales 
        JOIN products ON sales.product_id = products.id";

$result = $conn->query($sql);

while($row = $result->fetch_assoc()) {
    echo "<tr>
    <td>".$row['name']."</td>
    <td>".$row['price']."</td>
    <td>".$row['quantity_sold']."</td>
    <td>".$row['total_price']."</td>
    <td>".$row['date']."</td>
    </tr>";
}
?>

</table>

</div>
</div>
</body>
</html>