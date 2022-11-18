<?php

$savePath=$_POST["path"];
$data=$_POST["value"];

$myfile = fopen($savePath, "w") or die("Unable to open file!");

fwrite($myfile, $data);
fclose($myfile);
?>