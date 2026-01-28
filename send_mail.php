<?php
// 文字エンコーディング設定
mb_language("Japanese");
mb_internal_encoding("UTF-8");

header('Content-Type: application/json; charset=UTF-8');

// POSTリクエストのみ許可
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '不正なリクエストです。']);
    exit;
}

// 送信先メールアドレス（管理者）
$admin_email = 'info@denki-kitami.com';
$admin_name = '北見の街の電気屋さん';

// フォームデータの取得とサニタイズ
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$tel = isset($_POST['tel']) ? trim($_POST['tel']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$service = isset($_POST['service']) ? trim($_POST['service']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// バリデーション
$errors = [];

if (empty($name)) {
    $errors[] = 'お名前は必須です。';
}

if (empty($tel)) {
    $errors[] = 'お電話番号は必須です。';
}

// メールアドレスの形式チェック（入力されている場合のみ）
if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'メールアドレスの形式が正しくありません。';
}

// エラーがある場合は返す
if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode("\n", $errors)]);
    exit;
}

// 現在の日時
$datetime = date('Y年m月d日 H:i:s');

// 管理者向けメール内容
$admin_subject = '【北見の街の電気屋さん】新しいお問い合わせ';
$admin_body = "北見の街の電気屋さんのWebサイトより、新しいお問い合わせがありました。\r\n\r\n";
$admin_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\r\n";
$admin_body .= "■ お名前\r\n";
$admin_body .= $name . "\r\n\r\n";
$admin_body .= "■ お電話番号\r\n";
$admin_body .= $tel . "\r\n\r\n";
$admin_body .= "■ メールアドレス\r\n";
$admin_body .= (!empty($email) ? $email : '（未入力）') . "\r\n\r\n";
$admin_body .= "■ ご希望のサービス\r\n";
$admin_body .= (!empty($service) ? $service : '（未選択）') . "\r\n\r\n";
$admin_body .= "■ ご相談内容\r\n";
$admin_body .= (!empty($message) ? $message : '（未入力）') . "\r\n\r\n";
$admin_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\r\n";
$admin_body .= "送信日時: " . $datetime . "\r\n";

// お客様向け自動返信メール内容
$customer_subject = '【北見の街の電気屋さん】お問い合わせありがとうございます';
$customer_body = $name . " 様\r\n\r\n";
$customer_body .= "この度は、北見の街の電気屋さんにお問い合わせいただき、誠にありがとうございます。\r\n";
$customer_body .= "以下の内容でお問い合わせを承りました。\r\n\r\n";
$customer_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\r\n";
$customer_body .= "■ お名前\r\n";
$customer_body .= $name . "\r\n\r\n";
$customer_body .= "■ お電話番号\r\n";
$customer_body .= $tel . "\r\n\r\n";
$customer_body .= "■ メールアドレス\r\n";
$customer_body .= $email . "\r\n\r\n";
$customer_body .= "■ ご希望のサービス\r\n";
$customer_body .= (!empty($service) ? $service : '（未選択）') . "\r\n\r\n";
$customer_body .= "■ ご相談内容\r\n";
$customer_body .= (!empty($message) ? $message : '（未入力）') . "\r\n\r\n";
$customer_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\r\n\r\n";
$customer_body .= "担当者より折り返しご連絡させていただきますので、\r\n";
$customer_body .= "今しばらくお待ちくださいますようお願い申し上げます。\r\n\r\n";
$customer_body .= "お急ぎの場合は、お電話でもご相談を承っております。\r\n";
$customer_body .= "TEL: 070-4080-0965\r\n\r\n";
$customer_body .= "※このメールは自動送信されています。\r\n";
$customer_body .= "※このメールに返信いただいても対応できませんので、ご了承ください。\r\n\r\n";
$customer_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\r\n";
$customer_body .= "北見の街の電気屋さん\r\n";
$customer_body .= "TEL: 070-4080-0965\r\n";
$customer_body .= "営業時間: 9:00～19:00（年中無休）\r\n";
$customer_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\r\n";

// メールヘッダー（管理者宛）
$headers_admin = "From: " . mb_encode_mimeheader("北見の街の電気屋さん お問い合わせフォーム", "UTF-8") . " <info@denki-kitami.com>\r\n";
$headers_admin .= "Reply-To: " . (!empty($email) ? $email : "info@denki-kitami.com") . "\r\n";
$headers_admin .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers_admin .= "Content-Transfer-Encoding: 8bit\r\n";
$headers_admin .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// メールヘッダー（お客様宛）
$headers_customer = "From: " . mb_encode_mimeheader("北見の街の電気屋さん", "UTF-8") . " <info@denki-kitami.com>\r\n";
$headers_customer .= "Reply-To: info@denki-kitami.com\r\n";
$headers_customer .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers_customer .= "Content-Transfer-Encoding: 8bit\r\n";
$headers_customer .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// 管理者宛メール送信
$mail_sent_admin = mb_send_mail($admin_email, $admin_subject, $admin_body, $headers_admin);

// お客様への自動返信メール（メールアドレスが入力されている場合のみ）
$mail_sent_customer = true;
if (!empty($email)) {
    $mail_sent_customer = mb_send_mail($email, $customer_subject, $customer_body, $headers_customer);
}

// 結果を返す
if ($mail_sent_admin && $mail_sent_customer) {
    echo json_encode([
        'success' => true,
        'message' => 'お問い合わせを受け付けました。ご連絡ありがとうございます。'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'メール送信に失敗しました。お電話でのお問い合わせをお願いいたします。'
    ]);
}
?>
