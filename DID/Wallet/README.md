# DID Wallet Service 👛

DID 시스템의 지갑 서비스로, 사용자의 디지털 신원(DID) 생성, 관리 및 Verifiable Credentials와 Presentations를 처리하는 웹 인터페이스와 REST API를 제공합니다.

## 🌟 주요 기능

- **🆔 DID 생성 및 관리**: 새로운 분산 신원 생성과 관리
- **🔑 키 쌍 관리**: 암호화 키 생성, 저장 및 보안 관리
- **📜 Credential 저장**: Verifiable Credential 수신 및 안전한 저장
- **📋 Presentation 생성**: 선택적 정보 공개를 위한 Verifiable Presentation 생성
- **🌐 웹 인터페이스**: 직관적인 사용자 인터페이스
- **🔐 보안 저장소**: 개인키와 자격증명의 안전한 로컬 저장
- **📱 QR 코드 지원**: 모바일 친화적인 QR 코드 생성 및 스캔

## 🚀 빠른 시작

### 1. 설치

```bash
cd Wallet
npm install
```

### 2. 환경 설정

`.env` 파일을 생성하고 다음 설정을 추가하세요:

```env
PORT=3001
NODE_ENV=development
ETHEREUM_NETWORK=sepolia
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
ENCRYPTION_KEY=your_32_character_encryption_key_here
STORAGE_PATH=./data
```

### 3. 서비스 시작

```bash
npm start
```

서비스가 시작되면 다음 주소에서 접근할 수 있습니다:
- **웹 인터페이스**: http://localhost:3001
- **API 엔드포인트**: http://localhost:3001/api

## 🌐 웹 인터페이스

### 접속 방법
브라우저에서 `http://localhost:3001`으로 접속하면 사용자 친화적인 지갑 인터페이스를 사용할 수 있습니다.

### 주요 기능
1. **🆔 DID 관리**: 새 DID 생성 및 기존 DID 조회
2. **📜 Credential 저장소**: 받은 자격증명 보기 및 관리
3. **📋 Presentation 생성**: 필요한 정보만 선택하여 증명서 생성
4. **🔑 키 관리**: 개인키 백업 및 복원
5. **📱 QR 코드**: 모바일 장치와의 쉬운 연동

### 사용 흐름
1. **DID 생성** → 새로운 디지털 신원 생성
2. **Credential 수신** → Issuer로부터 자격증명 받기
3. **Presentation 생성** → 필요한 정보만 선별하여 증명서 작성
4. **검증 요청** → Verifier에게 증명서 제출

## 📡 REST API

### 기본 엔드포인트

#### 1. DID 관리

**새 DID 생성**
```http
POST /api/did/create
Content-Type: application/json

{
  "alias": "my-identity",
  "keyType": "secp256k1"
}
```

**응답:**
```json
{
  "success": true,
  "did": "did:ethr:0x1234567890123456789012345678901234567890",
  "publicKey": "0x04...",
  "address": "0x1234567890123456789012345678901234567890"
}
```

**DID 목록 조회**
```http
GET /api/did/list
```

#### 2. Credential 관리

**Credential 저장**
```http
POST /api/credentials/store
Content-Type: application/json

{
  "credential": {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiableCredential"],
    "issuer": "did:ethr:0x...",
    "credentialSubject": { ... },
    "proof": { ... }
  },
  "alias": "university-degree"
}
```

**Credential 목록 조회**
```http
GET /api/credentials/list
```

**특정 Credential 조회**
```http
GET /api/credentials/:id
```

#### 3. Presentation 생성

**Verifiable Presentation 생성**
```http
POST /api/presentations/create
Content-Type: application/json

{
  "holderDid": "did:ethr:0x...",
  "credentialIds": ["cred1", "cred2"],
  "domain": "example.com",
  "challenge": "random-challenge-string"
}
```

**응답:**
```json
{
  "success": true,
  "presentation": {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiablePresentation"],
    "holder": "did:ethr:0x...",
    "verifiableCredential": [ ... ],
    "proof": { ... }
  }
}
```

#### 4. 키 관리

**개인키 백업**
```http
GET /api/keys/backup/:did
```

**키 복원**
```http
POST /api/keys/restore
Content-Type: application/json

{
  "did": "did:ethr:0x...",
  "encryptedPrivateKey": "...",
  "password": "user-password"
}
```

## 🏗️ 프로젝트 구조

```
Wallet/
├── src/
│   ├── index.js              # 메인 서버 파일
│   ├── routes/
│   │   ├── did.js           # DID 관리 라우트
│   │   ├── credentials.js   # Credential 관리 라우트
│   │   ├── presentations.js # Presentation 생성 라우트
│   │   └── keys.js          # 키 관리 라우트
│   ├── services/
│   │   ├── didService.js    # DID 생성 및 관리
│   │   ├── credentialService.js # Credential 저장/조회
│   │   ├── presentationService.js # Presentation 생성
│   │   └── keyService.js    # 키 관리 및 암호화
│   ├── storage/
│   │   ├── fileStorage.js   # 로컬 파일 저장
│   │   └── encryption.js    # 데이터 암호화
│   └── utils/
│       ├── crypto.js        # 암호화 유틸리티
│       ├── ethereum.js      # 이더리움 연동
│       └── qrcode.js        # QR 코드 생성
├── public/                  # 웹 인터페이스 파일
│   ├── index.html          # 메인 페이지
│   ├── styles.css          # 스타일시트
│   ├── app.js              # 클라이언트 JavaScript
│   └── assets/             # 이미지 및 리소스
├── data/                   # 로컬 데이터 저장소
│   ├── dids/              # DID 정보
│   ├── credentials/       # 저장된 Credentials
│   └── keys/              # 암호화된 개인키
├── package.json
├── .env.example
└── README.md
```

## 🔧 개발 도구

### 개발 모드 실행
```bash
npm run dev
```

### 테스트 실행
```bash
npm test
```

### 데이터 초기화
```bash
npm run clean
```

## 🔌 다른 서비스와의 연동

### Issuer 서비스 (포트 3002)
- Credential 발급 요청 및 수신
- 발급자 검증 및 신뢰성 확인

### Verifier 서비스 (포트 3003)
- Presentation 제출 및 검증
- 검증 결과 수신 및 처리

### 통합 워크플로우
1. **Wallet**에서 DID 생성
2. **Issuer**에 Credential 발급 요청
3. **Wallet**에서 Credential 수신 및 저장
4. **Wallet**에서 Presentation 생성
5. **Verifier**에게 Presentation 제출

## 📊 사용 예시

### 웹 인터페이스 사용
1. 브라우저에서 `http://localhost:3001` 접속
2. "새 DID 생성" 버튼 클릭
3. 생성된 DID로 Issuer에서 Credential 발급 요청
4. 받은 Credential을 지갑에 저장
5. 필요시 Presentation 생성하여 Verifier에게 제출

### API 사용 (curl)
```bash
# 새 DID 생성
curl -X POST http://localhost:3001/api/did/create \
  -H "Content-Type: application/json" \
  -d '{"alias": "my-identity", "keyType": "secp256k1"}'

# Credential 저장
curl -X POST http://localhost:3001/api/credentials/store \
  -H "Content-Type: application/json" \
  -d @credential.json

# Presentation 생성
curl -X POST http://localhost:3001/api/presentations/create \
  -H "Content-Type: application/json" \
  -d '{
    "holderDid": "did:ethr:0x...",
    "credentialIds": ["cred1"],
    "domain": "verifier.example.com",
    "challenge": "abc123"
  }'
```

## 🔒 보안 고려사항

### 개인키 보호
- **AES-256 암호화**: 모든 개인키는 강력한 암호화로 보호
- **로컬 저장**: 개인키는 서버로 전송되지 않고 로컬에만 저장
- **백업 지원**: 안전한 키 백업 및 복원 기능

### 데이터 보안
- **암호화된 저장**: 모든 민감한 데이터는 암호화되어 저장
- **세션 관리**: 안전한 세션 처리 및 타임아웃
- **입력 검증**: 모든 입력 데이터의 엄격한 검증

### 네트워크 보안
- **HTTPS 지원**: 프로덕션 환경에서 HTTPS 사용 권장
- **CORS 설정**: 적절한 교차 출처 리소스 공유 설정
- **Rate Limiting**: API 요청 제한으로 남용 방지

## 🔄 백업 및 복원

### 지갑 백업
```bash
# 전체 지갑 데이터 백업
curl http://localhost:3001/api/backup/export > wallet-backup.json

# 특정 DID 백업
curl http://localhost:3001/api/keys/backup/did:ethr:0x... > did-backup.json
```

### 지갑 복원
```bash
# 백업 파일로부터 복원
curl -X POST http://localhost:3001/api/backup/import \
  -H "Content-Type: application/json" \
  -d @wallet-backup.json
```

## 🚨 문제 해결

### 일반적인 문제들

#### 1. 서비스 시작 실패
```bash
Error: Cannot find module 'ethers'
```
**해결방법:** `npm install` 실행

#### 2. DID 생성 실패
```bash
Error: Invalid RPC connection
```
**해결방법:** 
- `.env` 파일의 `RPC_URL` 확인
- 네트워크 연결 상태 확인

#### 3. Credential 저장 실패
```bash
Error: Invalid credential format
```
**해결방법:**
- Credential JSON 형식 확인
- 발급자 서명 유효성 확인

#### 4. 암호화 오류
```bash
Error: Decryption failed
```
**해결방법:**
- 암호화 키 확인
- 데이터 무결성 검사

### 데이터 복구
```bash
# 손상된 데이터 복구
npm run recover

# 데이터베이스 재구축
npm run rebuild
```

## 📱 모바일 지원

### QR 코드 기능
- **DID 공유**: QR 코드로 DID 쉽게 공유
- **Credential 수신**: QR 코드 스캔으로 Credential 받기
- **Presentation 제출**: QR 코드로 빠른 증명서 제출

### 반응형 디자인
- 모바일 브라우저 최적화
- 터치 친화적 인터페이스
- 빠른 로딩 및 오프라인 지원

## 📞 지원

문제가 발생하거나 질문이 있으시면:
1. 로그 파일 확인 (`./logs/wallet.log`)
2. GitHub Issues에 문제 보고
3. 개발팀에 문의

## 📄 라이선스

MIT License - 자세한 내용은 LICENSE 파일을 참조하세요.

---

**DID Wallet Service** - 안전하고 편리한 디지털 신원 관리 💼