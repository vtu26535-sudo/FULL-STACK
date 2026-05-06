<?php include 'db.php'; ?>

<html>
<head>
<link rel="stylesheet" href="style.css">
</head>
<body>

<?php include 'navbar.php'; ?>

<div class="container">

<?php
$p = $conn->query("SELECT COUNT(*) as total FROM products")->fetch_assoc();
$s = $conn->query("SELECT SUM(total_price) as total FROM sales")->fetch_assoc();
$q = $conn->query("SELECT SUM(quantity_sold) as total FROM sales")->fetch_assoc();
?>

<div class="card">
<h2>Total Products: <?php echo $p['total']; ?></h2>
</div>

<div class="card">
<h2>Total Sold: <?php echo $q['total'] ?? 0; ?></h2>
</div>

<div class="card">
<h2>Total Revenue: ₹<?php echo $s['total'] ?? 0; ?></h2>
</div>

</div>
</body>
</html>