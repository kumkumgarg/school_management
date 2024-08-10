<?php

use App\Models\Location;
use App\Models\User;
/**
 * Generates a random string of specified length and ensures it's unique within the specified model.
 *
 * @param string $model_name The name of the model to check for uniqueness (e.g., 'User', 'Device', 'Batch').
 * @param int $length_of_string The desired length of the random string. Default is 10.
 * @param boolean $use_caps Default false. Set to true if you want to include capital letters.
 * @return string A unique random string of the specified length.
 * @throws InvalidArgumentException If the model name is invalid.
 */
function random_strings(string $model_name, $length_of_string = 10, $use_caps = false): string
{
    // Mapping of model names to their corresponding class names
    $model_map = [
        'User' => User::class,
        'Location' => Location::class,
    ];

    // Check if the provided model name is valid
    if (!array_key_exists($model_name, $model_map)) {
        throw new InvalidArgumentException("Invalid model name: $model_name");
    }

    // String of all alphanumeric character
    $str_result = "0123456789abcdefghijklmnopqrstuvwxyz";
    if ($use_caps) {
        $str_result = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    }

    $already = false;

    // Shufle the $str_result and returns substring of specified length
    $uuid = substr(str_shuffle($str_result), 0, $length_of_string);

    $class = $model_map[$model_name];

    $already = $class::where("uuid", $uuid)->withTrashed()->exists();

    if ($already) {
        return random_strings($model_name, $length_of_string);
    }

    return $uuid;
}

/**
 * a temp password
 */
function temp_pass(Int $length_of_string = 10)
{
    // String of all alphanumeric character
    $str_result = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+=[]{},.<>;:/?";
    // Shufle the $str_result and returns substring
    // of specified length
    $temp = substr(str_shuffle($str_result), 0, $length_of_string);

    return $temp;
}
