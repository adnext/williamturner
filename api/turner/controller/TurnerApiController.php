<?php
//dependencies
require_once(__DIR__.'/../controller/TurnerController.php');

$requestMethod = filter_input(INPUT_SERVER, 'REQUEST_METHOD'); //$_SERVER['REQUEST_METHOD']
$response = "An error has occurred";

$turnerController = new TurnerController();

switch ($requestMethod) {
    case 'POST':
        $response = $turnerController->post(filter_input(INPUT_POST, 'text'));
        break;
    case 'GET':
        $response = $turnerController->get(filter_input(INPUT_GET, 'text'));
        break;
    case 'REMOVE':
        $response = "TODO REMOVE";
        break;
    default:
        $response = "TODO Default";
        break;
}

header("Content-Type: application/json");
exit(json_encode($response));