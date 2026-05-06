<?php
session_start();
include 'db.php';

if(!isset($_SESSION['user'])) {
    header("Location: login.php");
}
?>

<html>
<head>
<link rel="stylesheet" href="style.css">
</head>
<body>

<?php include 'navbar.php'; ?>

<div class="container">

<!-- ADD PRODUCT -->
<div class="card">
<h2>Add Product</h2>

<form action="add_product.php" method="POST">
    <input type="text" name="name" placeholder="Product Name" required>
    <input type="number" name="price" placeholder="Price" required>
    <input type="number" name="quantity" placeholder="Stock" required>
    <button class="btn btn-sell">Add</button>
</form>
</div>

<!-- PRODUCT LIST -->
<div class="card">

<h2>Product List</h2>

<!-- SEARCH -->
<form method="GET">
<input type="text" name="search" placeholder="Search product...">
<button class="btn btn-view">Search</button>
</form>

<br>

<table>
<tr>
<th>ID</th>
<th>Name</th>
<th>Price</th>
<th>Stock</th>
<th>Actions</th>
</tr>

<?php
$search = $_GET['search'] ?? '';
$sql = "SELECT * FROM products WHERE name LIKE '%$search%'";
$result = $conn->query($sql);

while($row = $result->fetch_assoc()) {
    echo "<tr>
    <td>".$row['id']."</td>
    <td>".$row['name']."</td>
    <td>₹".$row['price']."</td>
    <td>".$row['quantity']."</td>
    <td>

    <!-- SELL -->
    <form action='sell_product.php' method='POST' style='display:inline;'>
        <input type='hidden' name='product_id' value='".$row['id']."'>
        <input type='number' name='quantity' placeholder='Qty' required>
        <button class='btn btn-sell'>Sell</button>
    </form>

    <!-- VIEW -->
    <a href='view_product.php?id=".$row['id']."'>
        <button class='btn btn-view'>View</button>
    </a>

    <!-- EDIT -->
    <a href='edit_product.php?id=".$row['id']."'>
        <button class='btn btn-edit'>Edit</button>
    </a>

    <!-- DELETE -->
    <a href='delete_product.php?id=".$row['id']."' onclick=\"return confirm('Delete this product?')\">
        <button class='btn btn-delete'>Delete</button>
    </a>

    </td>
    </tr>";
}
?>

</table>
</div>

</div>
</body>
</html>