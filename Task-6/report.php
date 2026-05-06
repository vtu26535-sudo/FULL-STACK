<?php
include "connect.php";

$result = mysqli_query($conn,"SELECT * FROM daily_activity_report");

echo "<h2>Daily Activity Report</h2>";

while($row=mysqli_fetch_assoc($result))
{
echo "Date: ".$row['activity_date']." - Actions: ".$row['total_actions']."<br>";
}
?>