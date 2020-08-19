#!/usr/bin/bash
ssh -tt chen@htchenlisa.com<<EOF
	cd ~/forum
	git pull origin deploy
	npm run prod-build
	pm2 restart forum
	exit
EOF
