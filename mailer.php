<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

function sendOtpMail($to, $otp) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'help.rekakarya@gmail.com'; // ganti email kamu
        $mail->Password   = 'zkjm btzn xzij rtkq';   // gunakan App Password Gmail
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        $mail->setFrom('help.rekakarya@gmail.com', 'PPDB Online');
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->Subject = 'Kode OTP Reset Password';
        $mail->Body    = "Kode OTP kamu adalah <b>$otp</b>. Berlaku 10 menit.";

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}
