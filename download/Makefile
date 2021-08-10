start-service:
	sudo cp download-nhk-radio.service /etc/systemd/system
	sudo systemctl enable download-nhk-radio.service
	sudo systemctl start download-nhk-radio.service

stop-service:
	sudo systemctl stop download-nhk-radio.service
	sudo systemctl disable download-nhk-radio.service
	sudo rm /etc/systemd/system/download-nhk-radio.service



init-nodejs-on-rpi:
	curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
	sudo apt-get install -y nodejs
    
	curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
	echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
	sudo apt-get update && sudo apt-get install yarn
