
directory-settings:
	rm -r ./tmp
	mkdir ./tmp

	mkdir -p /mnt/nas/radio/NHK\ FM/ディスカバー・クイーン
	ln -s /mnt/nas/radio/NHK\ FM/ディスカバー・クイーン ./tmp/

	mkdir -p /mnt/nas/radio/NHK\ FM/ジャズ・トゥナイト
	ln -s /mnt/nas/radio/NHK\ FM/ジャズ・トゥナイト ./tmp/

	mkdir -p /mnt/nas/radio/NHK\ FM/リサイタル・パッシオ
	ln -s /mnt/nas/radio/NHK\ FM/リサイタル・パッシオ ./tmp/

	mkdir -p /mnt/nas/radio/NHK\ NHK2/英会話タイムトライアル
	ln -s /mnt/nas/radio/NHK\ NHK2/英会話タイムトライアル ./tmp/

	mkdir -p /mnt/nas/radio/NHK\ NHK2/ラジオ英会話
	ln -s /mnt/nas/radio/NHK\ NHK2/ラジオ英会話 ./tmp/

start-service:
	sudo cp download-nhk-radio.service /etc/systemd/system
	sudo systemctl enable download-nhk-radio.service
	sudo systemctl start download-nhk-radio.service

stop-service:
	sudo systemctl stop download-nhk-radio.service
	sudo systemctl disable download-nhk-radio.service
	sudo rm /etc/systemd/system/download-nhk-radio.service



