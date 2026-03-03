<?php include 'config.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <title>Inventory System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
<h1>Inventory Control System</h1>

<!-- Add Product Form -->
<form action="add_product.php" method="POST">
    <input type="text" name="product_name" placeholder="Product Name" required>
    <input type="text" name="category" placeholder="Category">
    <input type="number" step="0.01" name="price" placeholder="Price">
    <button type="submit">Add Product</button>
</form>

<table>
<tr>
    <th>ID</th>
    <th>Name</th>
    <th>Category</th>
    <th>Price</th>
    <th>Quantity</th>
    <th>Actions</th>
</tr>

<?php
$result = $conn->query("SELECT * FROM products");
while($row = $result->fetch_assoc()):
?>

<tr>
<td><?= $row['id'] ?></td>
<td><?= $row['product_name'] ?></td>
<td><?= $row['category'] ?></td>
<td><?= $row['price'] ?></td>
<td><?= $row['quantity'] ?></td>
<td>
    <a href="update_stock.php?id=<?= $row['id'] ?>">Update</a> |
    <a href="delete_product.php?id=<?= $row['id'] ?>">Delete</a>
</td>
</tr>

<?php endwhile; ?>
</table>

</div>
</body>
</html>