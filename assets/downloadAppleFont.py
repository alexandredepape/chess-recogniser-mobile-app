# Download apple's font from https://developer.apple.com/fonts/
# and save it to assets/fonts

from bs4 import BeautifulSoup
import requests
import os
import urllib.request
import urllib.parse
import urllib.error

# download apple's font from https://developer.apple.com/fonts/
# and save it to assets/fonts
def downloadAppleFont():
    # fetch font
    url = 'https://developer.apple.com/fonts/'
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    fontLink = soup.find('a', {'class': 'download-link'})['href']
    # save font
    # create fonts dir
    if not os.path.exists('fonts'):
        os.makedirs('fonts')
    # save font
    urllib.request.urlretrieve(fontLink, 'fonts/SF-Pro-Display-Font.zip')

# download apple's font from https://developer.apple.com/fonts/
# and save it to assets/fonts
downloadAppleFont()
