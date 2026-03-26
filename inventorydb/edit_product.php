<?php
session_start();
include 'db.php';

if(!isset($_SESSION['user'])) {
    header("Location: login.php");
}

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

<h2>Edit Product</h2>

<form action="update_product.php" method="POST">
    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">

    <input type="text" name="name" value="<?php echo $row['name']; ?>" required>
    <input type="number" name="price" value="<?php echo $row['price']; ?>" required>
    <input type="number" name="quantity" value="<?php echo $row['quantity']; ?>" required>

    <button>Update</button>
</form>

</div>
</div>

</body>
</html>