<?php

    if(isset($_POST['time'])){
        if(!isset($_COOKIE['record'])){
            $real_time = $_POST['time']-1;
            setcookie('record',$real_time,time()+31556926 ,'/');
            $time = gmdate("i:s", $real_time);
            echo "Twój nowy rekord osobisty wynosi: ".$time;
            unset($_POST['time']);
            exit();
        }
        else if(isset($_COOKIE['record'])&&$_COOKIE['record']>$_POST['time']){
            $real_time = $_POST['time']-1;
            setcookie('record',$real_time,time()+31556926 ,'/');
            $time = gmdate("i:s", $real_time);
            echo "Twój nowy rekord osobisty wynosi: ".$time;
            unset($_POST['time']);
            exit();
        }

        unset($_POST['time']);
    }

?>