<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/upload', function () {
    header('Content-type:application/json;charset=utf-8');

    // Adding this 1 sec sleep to slow down the upload process to better see the progress
    sleep(1);

    try {
        if (
            !isset($_FILES['file']['error']) ||
            is_array($_FILES['file']['error'])
        ) {
            throw new RuntimeException('Invalid parameters.');
        }

        switch ($_FILES['file']['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                throw new RuntimeException('No file sent.');
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                throw new RuntimeException('Exceeded filesize limit.');
            default:
                throw new RuntimeException('Unknown errors.');
        }

        $filepath = public_path() . '/assets/content-uploader/temp/' . uniqid() . '_' . $_FILES['file']['name'];

        if (!move_uploaded_file(
            $_FILES['file']['tmp_name'],
            $filepath
        )) {
            throw new RuntimeException('Failed to move uploaded file.');
        }

        // All good, send the response
        echo json_encode([
            'status' => 'ok',
            'path' => $filepath
        ]);
    } catch (RuntimeException $e) {
        // Something went wrong, send the err message as JSON
        http_response_code(400);

        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
});
