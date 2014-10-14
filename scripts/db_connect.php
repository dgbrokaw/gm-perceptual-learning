<?php
/* this script connects to the database specified below */

$dbc = mysql_connect('localhost', 'eweitnau', 'eweitnau!mysql');
mysql_select_db('eweitnau', $dbc);

// !! change this for new experiment !!
$exp_id = 7; // pbp scene ordering v.4.0'

?>
