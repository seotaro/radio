
directory-settings:
	rm -r ./tmp
	mkdir ./tmp

	mkdir -p /mnt/nas/music/tmp/asrock-4x4-download-test/radio/NHK\ FM/ディスカバー・クイーン
	ln -s /mnt/nas/music/tmp/asrock-4x4-download-test/radio/NHK\ FM/ディスカバー・クイーン ./tmp/

	mkdir -p /mnt/nas/music/tmp/asrock-4x4-download-test/radio/NHK\ FM/ジャズ・トゥナイト
	ln -s /mnt/nas/music/tmp/asrock-4x4-download-test/radio/NHK\ FM/ジャズ・トゥナイト ./tmp/

	mkdir -p /mnt/nas/music/tmp/asrock-4x4-download-test/radio/NHK\ FM/リサイタル・パッシオ
	ln -s /mnt/nas/music/tmp/asrock-4x4-download-test/radio/NHK\ FM/リサイタル・パッシオ ./tmp/

	mkdir -p /mnt/nas/music/tmp/asrock-4x4-download-test/radio/NHK\ NHK2/英会話タイムトライアル
	ln -s /mnt/nas/music/tmp/asrock-4x4-download-test/radio/NHK\ NHK2/英会話タイムトライアル ./tmp/

	mkdir -p /mnt/nas/music/tmp/asrock-4x4-download-test/radio/NHK\ NHK2/ラジオ英会話
	ln -s /mnt/nas/music/tmp/asrock-4x4-download-test/radio/NHK\ NHK2/ラジオ英会話 ./tmp/

init:
	curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
	echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
	sudo apt update && sudo apt install yarn
	yarn install

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
