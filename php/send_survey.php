<?php

$token = "7243538546:AAGpadMB8B0_mSnr4tqpXVuOc4ggBsM-PC0";
$chat_id = "-4226805402";

$phone = ($_POST['phone']);
$theme = ($_POST['theme']);

$type = ($_POST['type']);
$room = ($_POST['room']);
$material = ($_POST['material']);
$area = ($_POST['area']);
$quantity = ($_POST['quantity']);

$utm_source = $_POST['utm_source'];
$utm_medium = $_POST['utm_medium'];
$utm_campaign = $_POST['utm_campaign'];
$utm_content = $_POST['utm_content'];
$utm_term = $_POST['utm_term'];

$arr = array(
    'Сайт:' => '...',
    'Тема:' => $theme,
    'Телефон:' => $phone,
    '' => '',
    'Ответы на вопросы:' => ' ',
    '1. Тип уборки:' => $type,
    '2. Вид помещения:' => $room,
    '3. Вид химчистки:' => $material,
    '4. Площадь:' => $area,
    '5. Количество посадочных мест:' => implode(", ", $quantity),
    '' => '',
    'UTM метки' => '',
    'utm_source:' => $utm_source,
    'utm_medium:' => $utm_medium,
    'utm_campaign:' => $utm_campaign,
    'utm_content:' => $utm_content,
    'utm_term:' => $utm_term,
);

foreach($arr as $key => $value) {
    $txt .= "<b>".$key."</b> ".$value."%0A";
};

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");

?>
