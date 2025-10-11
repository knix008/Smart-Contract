# DID Verifier Service 🔍

DID 시스템의 검증 서비스로, Verifiable Credentials와 Presentations의 유효성을 검증하는 웹 인터페이스와 REST API를 제공합니다.

## 🌟 주요 기능

- **🔍 Credential 검증**: Verifiable Credential의 서명과 구조 검증
- **📋 Presentation 검증**: Verifiable Presentation의 무결성 검증
- **🆔 DID 검증**: DID 문서의 유효성과 접근성 검사
- **🌐 웹 인터페이스**: 사용자 친화적인 웹 GUI 제공
- **📊 실시간 통계**: 검증 성공률과 사용 현황 모니터링
- **📝 검증 히스토리**: 모든 검증 결과 기록 및 추적

## 🚀 빠른 시작

### 1. 설치

```bash
cd Verifier
npm install
```

### 2. 환경 설정

`.env` 파일을 생성하고 다음 설정을 추가하세요:

```env
PORT=3003
NODE_ENV=development
ETHEREUM_NETWORK=sepolia
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
PRIVATE_KEY=your_private_key_here
```

### 3. 서비스 시작

```bash
npm start
```

서비스가 시작되면 다음 주소에서 접근할 수 있습니다:
- **웹 인터페이스**: http://localhost:3003
- **API 엔드포인트**: http://localhost:3003/api

## 🌐 웹 인터페이스

### 접속 방법
브라우저에서 `http://localhost:3003`으로 접속하면 직관적인 웹 인터페이스를 사용할 수 있습니다.

### 주요 탭
1. **Credential 검증**: JSON 형태의 Verifiable Credential 검증
2. **Presentation 검증**: Verifiable Presentation 검증  
3. **DID 검증**: DID 문서 유효성 검사

### 기능
- ✅ **실시간 검증**: 즉시 결과 확인
- 📊 **통계 대시보드**: 검증 성공률 모니터링
- 📝 **히스토리**: 과거 검증 결과 추적
- 🎨 **반응형 디자인**: 모든 디바이스에서 최적화

## 📡 REST API

### 기본 엔드포인트

#### 1. Credential 검증
```http
POST /api/verify/credential
Content-Type: application/json

{
  "credential": {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiableCredential"],
    "issuer": "did:ethr:0x...",
    "credentialSubject": { ... },
    "proof": { ... }
  }
}
```

**응답:**
```json
{
  "success": true,
  "valid": true,
  "message": "Credential이 성공적으로 검증되었습니다",
  "details": {
    "issuer": "did:ethr:0x...",
    "subject": "did:ethr:0x...",
    "type": ["VerifiableCredential", "EducationCredential"],
    "issuanceDate": "2024-01-01T00:00:00Z"
  }
}
```

#### 2. Presentation 검증
```http
POST /api/presentation/verify
Content-Type: application/json

{
  "presentation": {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiablePresentation"],
    "holder": "did:ethr:0x...",
    "verifiableCredential": [ ... ],
    "proof": { ... }
  }
}
```

#### 3. DID 검증
```http
POST /api/verifier/verify-did
Content-Type: application/json

{
  "did": "did:ethr:0x1234567890123456789012345678901234567890"
}
```

### 상태 코드
- `200`: 성공
- `400`: 잘못된 요청 (유효하지 않은 JSON 등)
- `422`: 검증 실패 (유효하지 않은 credential/presentation)
- `500`: 서버 오류

## 🏗️ 프로젝트 구조

```
Verifier/
├── src/
│   ├── index.js              # 메인 서버 파일
│   ├── routes/
│   │   ├── verification.js   # Credential 검증 라우트
│   │   ├── presentation.js   # Presentation 검증 라우트
│   │   └── verifier.js       # DID 검증 라우트
│   ├── services/
│   │   ├── credentialVerifier.js  # Credential 검증 로직
│   │   ├── presentationVerifier.js # Presentation 검증 로직
│   │   └── didVerifier.js          # DID 검증 로직
│   └── utils/
│       ├── crypto.js         # 암호화 유틸리티
│       ├── ethereum.js       # 이더리움 연동
│       └── logger.js         # 로깅 시스템
├── public/                   # 웹 인터페이스 파일
│   ├── index.html           # 메인 페이지
│   ├── styles.css           # 스타일시트
│   └── app.js              # 클라이언트 JavaScript
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

### 코드 린팅
```bash
npm run lint
```

## 🔌 다른 서비스와의 연동

### Wallet 서비스 (포트 3001)
- Credential과 Presentation 생성 후 검증 요청
- 사용자가 생성한 자격증명의 유효성 확인

### Issuer 서비스 (포트 3002)  
- 발급된 Credential의 검증
- 발급자 신원 확인

### 통합 테스트 시나리오
1. **Wallet**에서 DID 생성
2. **Issuer**에서 Credential 발급
3. **Wallet**에서 Presentation 생성
4. **Verifier**에서 모든 단계 검증

## 📊 사용 예시

### 웹 인터페이스 사용
1. 브라우저에서 `http://localhost:3003` 접속
2. "Credential 검증" 탭 선택
3. Wallet에서 생성한 credential JSON 붙여넣기
4. "검증하기" 버튼 클릭
5. 결과 확인 및 히스토리 저장

### API 사용 (curl)
```bash
# Credential 검증
curl -X POST http://localhost:3003/api/verify/credential \
  -H "Content-Type: application/json" \
  -d @credential.json

# DID 검증
curl -X POST http://localhost:3003/api/verifier/verify-did \
  -H "Content-Type: application/json" \
  -d '{"did": "did:ethr:0x1234567890123456789012345678901234567890"}'
```

## 🔒 보안 고려사항

- **Rate Limiting**: API 요청 제한 (15분당 200회)
- **입력 검증**: 모든 입력 데이터 엄격한 검증
- **CORS 설정**: 적절한 교차 출처 리소스 공유 설정
- **오류 처리**: 민감한 정보 노출 방지

## 🚨 문제 해결

### 일반적인 문제들

#### 1. 서비스 시작 실패
```bash
Error: Cannot find module 'express'
```
**해결방법:** `npm install` 실행

#### 2. RPC 연결 오류  
```bash
Error: Invalid RPC URL
```
**해결방법:** `.env` 파일의 `RPC_URL` 확인

#### 3. 검증 실패
```bash
Credential verification failed
```
**해결방법:** 
- Credential 형식 확인
- Issuer DID 유효성 확인
- 서명 무결성 확인

### 로그 확인
서비스 실행 시 콘솔에서 다음 정보를 확인할 수 있습니다:
- 🔍 서비스 시작 상태
- 📱 네트워크 정보
- 🔗 계약 주소 상태

## 📞 지원

문제가 발생하거나 질문이 있으시면:
1. 로그 파일 확인
2. GitHub Issues에 문제 보고
3. 개발팀에 문의

## 📄 라이선스

MIT License - 자세한 내용은 LICENSE 파일을 참조하세요.

---

**DID Verifier Service** - 신뢰할 수 있는 디지털 신원 검증 🛡️