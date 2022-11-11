const controls = $("a#game_controls");
const fields = $("div.window");
const one_t = $("#one_t");
const two_t = $("#two_t");
const three_t = $("#three_t");
const one_b = $("#one_b");
const two_b = $("#two_b");
const three_b = $("#three_b");
const record = $("#record");
const size = $("#size");

let bombs = new Map();
let game = false;
let bombs_fields = [];
let sets_bombs = false;
let flags = 0;
let timer = 0;
let bombs_count = size.data("min");
timer = parseInt(0);
let timerInterval;
let width = size.data("col");
let height = size.data("row");

start();

//Odbiornik zdarzeń po kliknięciu pola przez użytkownika
fields.click(check);
fields.on('contextmenu',flag);
fields.on('mousedown',ondown);

document.addEventListener('contextmenu', event => event.preventDefault());

//Restart
controls.click(start);

function start(){
    game = true;
    record.empty();
    timer = 0;
    bombs_count = size.data("min");
    clearInterval(timerInterval);
    timerfunc();
    timerInterval = setInterval(timerfunc,1000);
    bombs = new Map();
    flags = 0;
    sets_bombs = false;
    bombs_fields = [];
    bombs_counter(bombs_count);

    $("img",controls).attr("src","src/images/start_face.png");

    //Wypełnianie pól pustymi przestrzeniami
    for(let i=0; i<height; i++){
        bombs.set(i,[]);
        for(let x=0; x<width; x++){
            bombs.get(i).push(0);
        }
    }

    fields.each(function(){
        const $this = $(this);
        if($this.hasClass("flag")){
          $this.removeClass("flag");
        }
        $("img",$this).attr("src","src/images/b_col.png");
    });

    //ustawianie 10 bomb
    for(let i=0; i<bombs_count; i++){
        set_bombs();
    }
    
    console.log(bombs);
}

//ustawianie pól z bombami
function set_bombs(){
    let row = Math.floor(Math.random()*height+0);
    let col = Math.floor(Math.random()*width+0);

    if(bombs.get(row)[col]!="bomb"){
        bombs_fields.push(row,col);
        bombs.get(row)[col] = "bomb";
    }else{
        set_bombs();
    }
}


function check(){
    //sprawdzanie czy gra nadal trwa
    if(game!=true) return ;

    const $this = $(this);
    const row_clicked_field = $this.data("row");
    const col_clicked_field = $this.data("col");

    $("img",controls).attr("src","src/images/start_face.png");

    //sprawdzanie czy miejsce nie jest oflagowane
    if($this.hasClass("flag")) return ;

    //sprawdzanie czy bomba jest na danym polu
    if(bombs.get(row_clicked_field)[col_clicked_field]=="bomb") return game_over();

    //zbieranie koordynatów pól otaczających kliknięte pole
    let cords = [];
    cords = [];
    cords = cordsfunc(row_clicked_field,col_clicked_field);

    let return_flags = false;

    //sprawdzanie czy użytkownika oflagował odpowiednią ilość min żeby móc odsłonić teren
    if(bombs.get(row_clicked_field)[col_clicked_field]>0){
        return_flags = checking_flags(row_clicked_field, col_clicked_field,cords);
        if(!return_flags) return game_over();
        else if(return_flags=="Not enough") return ;
    }

    let bombs_around = 0;
    let to_check = [];

    //zbieranie pól do rekurencyjnego wywołania funkcji
    for(let x=0; x<cords.length; x=x+2){
        const val_field = bombs.get(cords[x])[cords[x+1]];
        const field = $("#row_"+cords[x]+"_col_"+cords[x+1]);

        if(val_field=="bomb"){
            bombs_around = bombs_around + 1;
        }
        else if(val_field==0){
            to_check.push(cords[x],cords[x+1]);
        }

    }

    if(bombs_around==0||return_flags==true){
        bombs.get(row_clicked_field)[col_clicked_field] = "checked";
        //wywołanie funkcji rekurencyjnie
        for(let x=0; x<to_check.length; x=x+2){
           const field = $("#row_"+to_check[x]+"_col_"+to_check[x+1]);
           field.click();
        }
    }else{
        bombs.get(row_clicked_field)[col_clicked_field] = bombs_around;
    }
    change_field($this,bombs_around,"b");

    check_win();
}

function flag(){
  $("img",controls).attr("src","src/images/start_face.png");
  const $this = $(this);
  const row = $this.data("row");
  const col = $this.data("col");

  if(game!=true) return ;

  if(bombs.get(row)[col]!="checked"&&!$this.hasClass("flag")){
    if(bombs.get(row)[col]<=0||bombs.get(row)[col]=="bomb"){
      $this.addClass("flag");
      change_field($this,"flag","b");
      flags++;
      bombs_count--;
    }
  }else if($this.hasClass("flag")){
      $this.removeClass("flag")
      change_field($this,"col","b");
      flags--;
      bombs_count++;
  }
  bombs_counter(bombs_count);
  check_win();
}

function bombs_counter(bombs_count){
    if(bombs_count>=10){
        const str = String(bombs_count);
        change_field(one_b,str[1],"t");
        change_field(two_b,str[0],"t");
        change_field(three_b,0,"t");
    }
    else if(bombs_count<10&&bombs_count>=0){
        change_field(one_b,bombs_count,"t");
        change_field(two_b,0,"t");
    }else if(bombs_count>-10&&bombs_count<0){
        const bombs_to_str = String(bombs_count)
        change_field(one_b,bombs_to_str[1],"t");
        change_field(two_b,"-","t");
        change_field(three_b,0,"t");
    }else{
        const bombs_to_str = String(bombs_count);
        change_field(one_b,bombs_to_str[2],"t");
        change_field(two_b,bombs_to_str[1],"t");
        change_field(three_b,"-","t");
    }
}

function timerfunc()
{
  if(!game) return ;

  if(timer<10){
      change_field(one_t,timer,"t");
      change_field(two_t,0,"t");
      change_field(three_t,0,"t");
  }else if(timer>=10&&timer<100){
      const str = String(timer);
      change_field(one_t,str[1],"t");
      change_field(two_t,str[0],"t");
  }else if(timer>=100&&timer<1000){
      const str = String(timer);
      change_field(one_t,str[2],"t");
      change_field(two_t,str[1],"t");
      change_field(three_t,str[0],"t");
  }else{
    game_over();
    change_field(one_t,9,"t");
    change_field(two_t,9,"t");
    change_field(three_t,9,"t");
  }

  timer = timer + 1;
}

function check_win(){
    const bomb_fields_qty = bombs_fields.length/2;
    let bombs_checked = true;
    let fields_not_checked = true;
    for(let x=0; x<bombs_fields.length; x=x+2){
        const field = $("#row_"+bombs_fields[x]+"_col_"+bombs_fields[x+1]);

        if(!$(field).hasClass("flag"))
        {
            bombs_checked = false;
        }
    }

    for(let i=0; i<height; i++){
        for(let x=0; x<width; x++){
            if(bombs.get(i)[x]==0){
                fields_not_checked = false;
            }
        }
    }

  if(bombs_checked&&flags==bomb_fields_qty&&fields_not_checked){
      game=false;
      $("img",controls).attr("src","src/images/chad_face.png");
      record_check();
  }
}

//zapisywanie rekordu w ciasteczkach
function record_check(){
    $.post("record.php",
        {
            time:timer,
        },
        function(data){
            record.html(data);
        }
    )
}

function checking_flags(row,col,cords){
    let flags_around = 0;
    let bombs_without_flags = 0;
    let bombs_around = bombs.get(row)[col];

    for(let x=0; x<cords.length; x=x+2){
        const val_field = bombs.get(cords[x])[cords[x+1]];
        const field = $("#row_"+cords[x]+"_col_"+cords[x+1]);

        if(val_field=="bomb"){
            if(!field.hasClass("flag")){
                bombs_without_flags = bombs_without_flags + 1;
            }else{
                flags_around = flags_around + 1;
            }
        }
        else if(field.hasClass("flag")){
            flags_around = flags_around + 1;
        }
    }

    if(flags_around==bombs_around){
        if(bombs_without_flags>0){
            return false;
        }
        else{
            return true;
        }
    }else{
        return "Not enough";
    }
}

function ondown(){
    if(!game) return ;
    $("img",controls).attr("src","src/images/wow_face.png");
}

function game_over(){
    game = false;
    clearInterval(timerInterval);

    $("img",controls).attr("src","src/images/dead_face.png");

    for(let x=0; x<bombs_fields.length; x=x+2){
        const field = $("#row_"+bombs_fields[x]+"_col_"+bombs_fields[x+1]);

        $('img',field).attr("src","src/images/bomb.png");
    }
}

function change_field(field, quantity_bombs, pron){
    const img = $('img', field);

    $(img).attr("src","src/images/"+pron+"_"+quantity_bombs+".png");
}

function cordsfunc(row_clicked_field,col_clicked_field)
{
    const width_r = width-1;    
    const height_r = height-1;    
    let cords = [];
    if(row_clicked_field!=0)
    {
        if(col_clicked_field!=0)
        {
            cords.push(row_clicked_field-1,col_clicked_field-1);
        }

        if(col_clicked_field!=width_r){
            cords.push(row_clicked_field-1,col_clicked_field+1);
        }

        cords.push(row_clicked_field-1,col_clicked_field);
    }

    if(row_clicked_field!=height_r)
    {
        if(col_clicked_field!=0)
        {
            cords.push(row_clicked_field+1,col_clicked_field-1);
        }

        if(col_clicked_field!=width_r){
            cords.push(row_clicked_field+1,col_clicked_field+1);
        }

        cords.push(row_clicked_field+1,col_clicked_field);
    }

    if(col_clicked_field!=0)
    {
        cords.push(row_clicked_field,col_clicked_field-1);
    }
    if(col_clicked_field!=width_r)
    {
        cords.push(row_clicked_field,col_clicked_field+1);
    }

    return cords;
}
