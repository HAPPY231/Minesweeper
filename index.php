<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="style.css"/>
    <script defer src="src/jquery-3.6.1.js"></script>
    <script defer src="javas.js"></script>
    <title>Minesweeper</title>
    <link rel="shortcut icon" href="src/images/favicon.png">
  </head>
  <body id="app">
    <?php
      $levels = [[9,9,10],[16,16,40],[16,30,99]]; 
      if(isset($_GET['size'])){
        $size_inf = $_GET['size'];
      }else{
        $size_inf = 0;
      }

      $width = $levels[$size_inf][1]*16;
    ?>
    <div id="options">
        <a href="?size=0" name="difficulty_level" class="Beginner <?php if($size_inf==0) {echo 'underline';} ?>">Beginner</a>
        <a href="?size=1" name="difficulty_level" class="Advanced <?php if($size_inf==1) {echo 'underline';} ?>">Advanced</a>
        <a href="?size=2" name="difficulty_level" class="Expert <?php if($size_inf==2) {echo 'underline';} ?>">Expert</a>
    </div>
    <nav style="width: <?=$width?>px">
      <div class="timer">
          <div id="three_b">
              <img src="src/images/t_0.png">
          </div>
          <div id="two_b">
              <img src="src/images/t_1.png">
          </div>
          <div id="one_b">
              <img src="src/images/t_0.png">
          </div>
      </div>
       <a id="game_controls"><img src="src/images/start_face.png"></a>
       <div class="timer">
           <div id="three_t">
               <img src="src/images/t_0.png">
           </div>
           <div id="two_t">
               <img src="src/images/t_0.png">
           </div>
           <div id="one_t">
               <img src="src/images/t_0.png">
           </div>
       </div>
    </nav>
<div class="game" style="width: <?=$width?>px;">
          <?php
            
             
            for($i=0; $i<$levels[$size_inf][0]; $i++){
              for($x=0; $x<$levels[$size_inf][1]; $x++){
echo<<<end
                  <div id="row_{$i}_col_{$x}" class="window" data-row="{$i}" data-col="{$x}"><img src="src/images/b_col.png"></div>
end;
              }
              echo "<div style='clear:both;'></div>";
            }
          ?>

          <input type="hidden" id="size" data-row="<?=$levels[$size_inf][0]?>" data-col="<?=$levels[$size_inf][1]?>" data-min="<?=$levels[$size_inf][2]?>">
</div>
          <div id="record"></div>
  </body>
</html>
