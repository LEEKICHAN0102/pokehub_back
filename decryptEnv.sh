#!/bin/bash

# 복호화된 내용을 직접 변수로 설정
decrypted=$(openssl enc -aes-256-cbc -d -in .env.enc -k pokehub_be -pbkdf2)

# 환경 변수 추출 및 export
export SERVER_PORT=$(echo "$decrypted" | grep '^SERVER_PORT=' | cut -d '=' -f 2-)
export DB_URL=$(echo "$decrypted" | grep '^DB_URL=' | cut -d '=' -f 2-)
export SESSION_SECRET=$(echo "$decrypted" | grep '^SESSION_SECRET=' | cut -d '=' -f 2-)

# Node.js 애플리케이션 실행
node src/server.js
