#!/bin/bash
cd /opt/football-world-vps && node scraper.js >> /var/log/football-scraper.log 2>&1
