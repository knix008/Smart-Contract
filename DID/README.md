# DID (Decentralized Identity) System

완전한 DID 생태계 구현 - Sepolia 테스트넷에서 동작하는 탈중앙화 신원 관리 시스템

## 🌟 시스템 개요

이 프로젝트는 다음 컴포넌트들로 구성된 완전한 DID 시스템입니다:

- **🔗 Smart Contracts**: DID 등록 및 Verifiable Credential 관리
- **💼 Wallet**: 이더리움 지갑 및 DID 관리
- **🏢 Issuer**: Verifiable Credential 발급 서비스
- **🔍 Verifier**: Credential 검증 서비스

## 📁 프로젝트 구조

```
DID/
├── SmartContracts/     # Solidity 스마트 컨트랙트
├── Wallet/            # 이더리움 지갑 서비스
├── Issuer/            # Credential 발급 서비스
└── Verifier/          # Credential 검증 서비스
```

## 🚀 빠른 시작

### 1. 환경 설정

각 서비스 디렉토리에서 환경 변수를 설정하세요:

```bash
# SmartContracts/.env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Wallet/.env
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
DID_REGISTRY_ADDRESS=contract_address_after_deployment

# Issuer/.env
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
DID_REGISTRY_ADDRESS=contract_address_after_deployment
ISSUER_PRIVATE_KEY=issuer_private_key_here

# Verifier/.env
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
DID_REGISTRY_ADDRESS=contract_address_after_deployment
```

### 2. 스마트 컨트랙트 배포

```bash
cd SmartContracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. 서비스 실행

각 서비스를 별도 터미널에서 실행:

```bash
# 지갑 서비스
cd Wallet
npm install
npm start

# 발급자 서비스
cd Issuer
npm install
npm start

# 검증자 서비스
cd Verifier
npm install
npm start
```

## 🛠️ 서비스별 상세 정보

### 📘 Smart Contracts (Port: Blockchain)

- **DIDRegistry.sol**: 메인 DID 관리 계약
- 기능: DID 등록, 업데이트, 취소, Credential 발급/취소
- 네트워크: Sepolia Testnet

### 💼 Wallet Service (Port: 3001)

- DID 생성 및 관리
- 이더리움 지갑 기능
- 트랜잭션 서명
- DID Document 관리

**주요 API:**
- `POST /api/wallet/generate` - 새 지갑 생성
- `POST /api/did/register` - DID 등록
- `GET /api/did/:didId` - DID 조회

### 🏢 Issuer Service (Port: 3002)

- Verifiable Credential 발급
- 4가지 자격증명 템플릿 지원
- 블록체인에 credential 기록

**주요 API:**
- `POST /api/credentials/issue` - Credential 발급
- `GET /api/issuer/templates` - 템플릿 조회
- `POST /api/credentials/:id/revoke` - Credential 취소

**지원하는 Credential 타입:**
- UniversityDegree (대학 학위)
- IdentityVerification (신원 확인)
- ProfessionalCertification (전문 자격)
- EmploymentVerification (고용 확인)

### 🔍 Verifier Service (Port: 3003)

- Verifiable Credential 검증
- Verifiable Presentation 검증
- DID 유효성 검사
- 검증 히스토리 관리

**주요 API:**
- `POST /api/verify/credential` - Credential 검증
- `POST /api/presentation/verify` - Presentation 검증
- `GET /api/verify/did/:didId` - DID 검증

## 🔧 사용 시나리오

### 시나리오 1: 대학생 학위 증명

1. **학생이 지갑 생성 및 DID 등록**
   ```bash
   curl -X POST http://localhost:3001/api/wallet/generate
   curl -X POST http://localhost:3001/api/did/register \
     -H "Content-Type: application/json" \
     -d '{"address": "STUDENT_ADDRESS"}'
   ```

2. **대학(Issuer)이 학위 증명서 발급**
   ```bash
   curl -X POST http://localhost:3002/api/credentials/issue \
     -H "Content-Type: application/json" \
     -d '{
       "subjectDID": "did:ethr:sepolia:STUDENT_ADDRESS",
       "credentialType": "UniversityDegree",
       "credentialSubject": {
         "university": "Seoul National University",
         "degree": "Bachelor of Computer Science",
         "graduationDate": "2024-02-15",
         "gpa": "4.2"
       }
     }'
   ```

3. **고용주(Verifier)가 학위 검증**
   ```bash
   curl -X POST http://localhost:3003/api/verify/credential \
     -H "Content-Type: application/json" \
     -d '{"credential": ISSUED_CREDENTIAL}'
   ```

### 시나리오 2: 취업 검증

1. **회사가 재직 증명서 발급**
2. **다른 회사가 경력 검증**
3. **전체 경력 이력 Presentation 생성 및 검증**

## 🔐 보안 기능

- **블록체인 기반 무결성**: 모든 DID와 Credential이 블록체인에 기록
- **암호화 서명**: ECDSA secp256k1 서명으로 모든 데이터 보호
- **취소 메커니즘**: 실시간 credential 취소 상태 확인
- **DID 검증**: 발급자와 소유자 DID 유효성 검사

## 📊 모니터링 및 관리

### 지갑 서비스 상태 확인
```bash
curl http://localhost:3001/health
```

### 발급자 통계 조회
```bash
curl http://localhost:3002/api/issuer/stats
```

### 검증자 통계 조회
```bash
curl http://localhost:3003/api/verifier/stats
```

## 🧪 테스트

### 스마트 컨트랙트 테스트
```bash
cd SmartContracts
npm test
```

### 통합 테스트
```bash
# 각 서비스가 실행 중인 상태에서
cd scripts
node integration-test.js
```

## 🚀 프로덕션 배포

### 환경별 설정

**개발 환경**
- Sepolia Testnet 사용
- 테스트 계정 및 ETH 사용

**프로덕션 환경**
- Ethereum Mainnet 또는 다른 메인넷 사용
- 실제 ETH 필요
- SSL/TLS 인증서 설정
- 로드 밸런서 구성

### 보안 고려사항

1. **개인키 관리**: HSM 또는 보안 키 관리 시스템 사용
2. **API 인증**: JWT 토큰 또는 OAuth 구현
3. **네트워크 보안**: VPN 또는 private network 구성
4. **데이터베이스**: 검증 히스토리를 위한 영구 저장소 구성

## 🔗 유용한 링크

- [W3C DID Specification](https://www.w3.org/TR/did-core/)
- [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)
- [Ethereum Sepolia Testnet](https://sepolia.etherscan.io/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 📞 지원 및 문의

이 DID 시스템에 대한 질문이나 지원이 필요하시면:

1. GitHub Issues를 통해 버그 리포트
2. 기능 요청사항 제출
3. 기술 문서 개선 제안

---

**⚡ 주의사항**: 이 시스템은 데모 및 개발 목적으로 설계되었습니다. 프로덕션 환경에서 사용하기 전에 추가적인 보안 감사와 테스트가 필요합니다.