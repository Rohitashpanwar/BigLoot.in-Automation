import os
import sys
import argparse
import requests
import base64
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from PIL import Image, ImageDraw, ImageFont


def build_affiliate_link(url: str) -> str:
    """Append Amazon affiliate tag to the URL."""
    parsed = list(urlparse(url))
    query = parse_qs(parsed[4])
    query['tag'] = 'bigloot-21'
    parsed[4] = urlencode(query, doseq=True)
    return urlunparse(parsed)


def create_banner(title: str, price: str, out_path: str) -> None:
    """Create a simple banner image."""
    width, height = 800, 400
    image = Image.new('RGB', (width, height), color=(73, 109, 137))
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 32)
    except IOError:
        font = ImageFont.load_default()
    text = f"{title}\nPrice: {price}"
    text_w, text_h = draw.multiline_textsize(text, font=font)
    x = (width - text_w) / 2
    y = (height - text_h) / 2
    draw.multiline_text((x, y), text, fill=(255, 255, 255), font=font, align="center")
    image.save(out_path)


def wordpress_headers(username: str, password: str) -> dict:
    token = base64.b64encode(f"{username}:{password}".encode()).decode()
    return {
        'Authorization': f'Basic {token}',
    }


def upload_media(wp_url: str, headers: dict, file_path: str) -> int:
    with open(file_path, 'rb') as f:
        media_headers = headers.copy()
        media_headers.update({
            'Content-Disposition': f'attachment; filename={os.path.basename(file_path)}',
            'Content-Type': 'image/png',
        })
        resp = requests.post(f"{wp_url}/wp-json/wp/v2/media", headers=media_headers, data=f)
    resp.raise_for_status()
    return resp.json().get('id')


def create_post(wp_url: str, headers: dict, title: str, content: str, media_id: int) -> str:
    data = {
        'title': title,
        'content': content,
        'status': 'publish',
        'featured_media': media_id,
    }
    resp = requests.post(f"{wp_url}/wp-json/wp/v2/posts", headers=headers, json=data)
    resp.raise_for_status()
    return resp.json().get('link')


def send_telegram(token: str, chat_id: str, text: str, photo_path: str) -> None:
    api_url = f"https://api.telegram.org/bot{token}"
    requests.post(f"{api_url}/sendMessage", data={'chat_id': chat_id, 'text': text})
    with open(photo_path, 'rb') as photo:
        requests.post(f"{api_url}/sendPhoto", data={'chat_id': chat_id}, files={'photo': photo})


def main():
    parser = argparse.ArgumentParser(description="Post deal to WordPress and Telegram")
    parser.add_argument('--title', required=True, help='Deal title')
    parser.add_argument('--link', required=True, help='Product link')
    parser.add_argument('--price', required=True, help='Deal price')
    args = parser.parse_args()

    affiliate = build_affiliate_link(args.link)
    banner_path = 'banner.png'
    create_banner(args.title, args.price, banner_path)

    wp_url = os.environ.get('WORDPRESS_URL')
    wp_user = os.environ.get('WORDPRESS_USERNAME')
    wp_pass = os.environ.get('WORDPRESS_PASSWORD')
    tg_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not all([wp_url, wp_user, wp_pass, tg_token]):
        print("Missing credentials in environment variables")
        sys.exit(1)

    headers = wordpress_headers(wp_user, wp_pass)
    media_id = upload_media(wp_url, headers, banner_path)
    post_link = create_post(wp_url, headers, args.title, f"<a href='{affiliate}'>Buy Now</a>", media_id)

    message = f"{args.title} - {args.price}\n{affiliate}\n{post_link}"
    send_telegram(tg_token, '@BigLoot', message, banner_path)
    print("Posted successfully")


if __name__ == '__main__':
    main()
