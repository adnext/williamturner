<?php

/**
 * Description of TurnerController
 *
 * @author Alexander Dvornichenko
 */
class TurnerController {

    public function post($input) {
        $lastPost = json_decode($input, true);
        $lastPostText = $lastPost['text'];

        return ["TurnerPost" => $lastPostText];
    }

    public function get($input) {

        return ["TurnerGet" => $input, "turned_text" => "turned_text"];
    }

    public function remove($param) {
        
    }

}
