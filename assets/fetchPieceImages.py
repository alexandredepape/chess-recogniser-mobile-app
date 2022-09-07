#fetch and save piece images from lichess.org
import requests
import os
import json
import time
import sys
import re
import urllib.request
import urllib.parse
import urllib.error
from bs4 import BeautifulSoup

#fetch and save piece images from lichess.org
def fetchPieceImages():
    #fetch piece images
    pieceImages = {}
    pieceImages['black-bishop'] = 'https://lichess1.org/assets/piece/cburnett/bB.svg'
    pieceImages['black-king'] = 'https://lichess1.org/assets/piece/cburnett/bK.svg'
    pieceImages['black-knight'] = 'https://lichess1.org/assets/piece/cburnett/bN.svg'
    pieceImages['black-pawn'] = 'https://lichess1.org/assets/piece/cburnett/bP.svg'
    pieceImages['black-queen'] = 'https://lichess1.org/assets/piece/cburnett/bQ.svg'
    pieceImages['black-rook'] = 'https://lichess1.org/assets/piece/cburnett/bR.svg'
    pieceImages['white-bishop'] = 'https://lichess1.org/assets/piece/cburnett/wB.svg'
    pieceImages['white-king'] = 'https://lichess1.org/assets/piece/cburnett/wK.svg'
    pieceImages['white-knight'] = 'https://lichess1.org/assets/piece/cburnett/wN.svg'
    pieceImages['white-pawn'] = 'https://lichess1.org/assets/piece/cburnett/wP.svg'
    pieceImages['white-queen'] = 'https://lichess1.org/assets/piece/cburnett/wQ.svg'
    pieceImages['white-rook'] = 'https://lichess1.org/assets/piece/cburnett/wR.svg'
    #save piece images
    # create pieceImages dir
    if not os.path.exists('pieceImages'):
        os.makedirs('pieceImages')
    # save piece images
    for pieceImage in pieceImages:
        urllib.request.urlretrieve(pieceImages[pieceImage], 'pieceImages/' + pieceImage + '.svg')

#fetch and save piece images from lichess.org
fetchPieceImages()
