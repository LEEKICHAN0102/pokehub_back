### PokéHub_BE | 포켓몬 도감  

<br>

## 목차
  - [개요](#개요)
  - [프로젝트 설치](#프로젝트-설치)
  - [프로젝트 설명](#프로젝트-설명)
  - [프로젝트 구조](#프로젝트-구조)
  - [API](#API)
  - [개발 환경](#개발-환경)
  - [개발 후기](#개발-후기)

<br>

## 개요
- 프로젝트 명: PokéHub_BE
- 개발 기간 : 24.01 ~ 24.03
- 개발 멤버 : 이기찬

<br>

## 프로젝트 설치

- AWS 프리티어 기간의 종료로 요금 부담이 커지면서 부득이 하게 배포환경을 중단하게 되었습니다. 로컬에서 작동하기 위한 프로젝트 설치는 다음과 같습니다.

1. Clone the Repository

> git clone https://github.com/LEEKICHAN0102/pokehub_back.git

2. Install Dependencies

> npm install

3. Start the development Server(Environmental variable decryption is required)

> sh decryptEnv.sh

4. Open the Project in your browser

> http://localhost:8080

- 더 많은 컨텐츠 이용을 위해 [PokéHub | FE](https://github.com/LEEKICHAN0102/pokehub_front) 설치

<br>

## 프로젝트 설명

#### PokéHub_BE 는 [PokéHub 프로젝트](https://pokehub-encyclopedia.vercel.app) 에서 사용 됩니다. [PokéAPI](https://pokeapi.co) 에서 얻을 수 없는 인물( 체육관 관장, 사천왕, 챔피언 )들의 정보와 [PokémonKorea](https://pokemonkorea.co.kr/news) 에서 제공 되는 이벤트 게시글에 대한 정보를 얻을 수 있습니다. 또한 [PokéHub 프로젝트](https://pokehub-encyclopedia.vercel.app) 에서 사용 되는 게시판 관련 정보를 포함 하고 있습니다.  

<br>

## 프로젝트 구조

```
pokehub_be/
├── src/
│   ├── character/
│   │   ├── gymLeader.js
│   │   ├── eliteFour.js
│   │   ├── champion.js
│   ├── event/
│   │   ├── event.js
│   ├── schema/
│   │   ├── shchema.js
│   ├── user/
│   │   ├── user.js
│   └── server.js
├── .babelrc
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## API
```
BASE_URL = https://pokehub-encyclopedia.site

1. 인물 정보
  > 1.1 포켓몬 관장 정보(All)
      | {BASE_URL}/gym-leader
  > 1.2 포켓몬 관장 정보(Detail)
      | {BASE_URL}/gym-leader/detail/{gymLeader.order}
  > 1.3 포켓몬 사천왕 정보(All)
      | {BASE_URL}/elite-four
  > 1.4 포켓몬 사천왕 정보(Detail)
      | {BASE_URL}/elite-four/detail/{eliteFour.order}
  > 1.5 포켓몬 챔피언 정보(All)
      | {BASE_URL}/champion
  > 1.6 포켓몬 사천왕 정보(Detail)
      | {BASE_URL}/champion/detail/{champion.order}

2. 이벤트
  > 2.1 이벤트 카드(All) Link to https://pokemonkorea.co.kr/news 
      | {BASE_URL}/event

3. 게시판
  > 3.1 게시글(페이지)
      | {BASE_URL}/board/{paginationNumber}
  > 3.2
      | {BASE_URL}/board/detail/(posting._id)

4. 프로필
  > 4.1 프로필
      | {BASE_URL}/profile/{userId}

```

<br/>

## 개발 환경

### Environment
<img src="https://img.shields.io/badge/Visual Studio code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white">  <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">  <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">  <img src="https://img.shields.io/badge/powershell-5391FE?style=for-the-badge&logo=powershell&logoColor=white">

### Package Manager
<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">

### Development
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"><img src="https://img.shields.io/badge/mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white"><img src="https://img.shields.io/badge/puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white"> <img src="https://img.shields.io/badge/bcrypt-FF6633?style=for-the-badge&&logoColor=white">

### Deployment
<img src="https://img.shields.io/badge/ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white"> <img src="https://img.shields.io/badge/amazon ec2-FF9900?style=for-the-badge&logo=amazon ec2&logoColor=white"> <img src="https://img.shields.io/badge/amazons3-569A31?style=for-the-badge&logo=amazons3&logoColor=white"> <img src="https://img.shields.io/badge/amazonroute53-8C4FFF?style=for-the-badge&logo=amazonroute53&logoColor=white">

### Process Manager
<img src="https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white">

<br/>

## 개발 후기
- ### [포켓몬 도감을 만들어보자v2 BE](https://velog.io/@rlcks01537/%ED%8F%AC%EC%BC%93%EB%AA%AC-%EB%8F%84%EA%B0%90%EC%9D%84-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EC%9E%90v2-BE)
