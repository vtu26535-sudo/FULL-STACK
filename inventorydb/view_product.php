<?php
include 'db.php';

$id = $_GET['id'];
$result = $conn->query("SELECT * FROM products WHERE id=$id");
$row = $result->fetch_assoc();
?>

<html>
<head>
<link rel="stylesheet" href="style.css">
</head>
<body>

<?php include 'navbar.php'; ?>

<div class="container">
<div class="card">

<h2>Product Details</h2>

<p><b>Name:</b> <?php echo $row['name']; ?></p>
<p><b>Price:</b> ₹<?php echo $row['price']; ?></p>
<p><b>Stock:</b> <?php echo $row['quantity']; ?></p>

<a href="products.php">
<button class="btn btn-view">Back</button>
</a>

</div>
</div>

</body>
</html>