<?php

  $arr = array(
    "message" => "你好 世界",
    "code" => 1,
    "count" => 102
  );

  $json = json_encode($arr);
  $cb = $_GET['callback'];
  echo $cb . "($json)";
?>
