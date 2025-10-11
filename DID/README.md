# DID (Decentralized Identity) System

완전한 DID 생태계 구현 - Sepolia 테스트넷에서 동작하는 탈중앙화 신원 관리 시스템

## 🌟 시스템 개요

이 프로젝트는 Ethereum 블록체인 기반의 완전한 DID 시스템으로, 사용자 친화적인 웹 인터페이스와 함께 다음 컴포넌트들로 구성됩니다:

- **🔗 Smart Contracts**: DID 등록 및 Verifiable Credential 관리 (Sepolia 배포됨)
- **💼 Wallet**: 이더리움 지갑 및 DID 관리 서비스 (포트 3001) - 웹 GUI 포함
- **🏢 Issuer**: Verifiable Credential 발급 서비스 (포트 3002) - 웹 GUI 포함
- **🔍 Verifier**: Credential 검증 서비스 (포트 3003) - ⭐ **새로운 현대적 웹 GUI**

### ✨ 최신 업데이트 (2025년 10월)
- 🎨 **Verifier 웹 GUI 완전 구현**: Bootstrap 5.3 기반의 현대적 인터페이스
- 📊 **실시간 검증 대시보드**: 통계 모니터링 및 히스토리 추적
- 📝 **개별 서비스 문서화**: 각 서비스별 상세 README.md 추가
- 🔧 **향상된 오류 처리**: 사용자 친화적인 오류 메시지
- 📱 **완전한 반응형 디자인**: 모든 디바이스에서 최적화

## 📁 프로젝트 구조

```
DID/
├── SmartContracts/     # Solidity 스마트 컨트랙트 (이미 배포됨)
├── Wallet/            # 이더리움 지갑 및 DID 관리 서비스 + 웹 GUI
│   ├── public/        # 웹 인터페이스 파일
│   ├── src/           # 서버 코드
│   └── README.md      # 상세 사용 가이드
├── Issuer/            # Credential 발급 서비스 + 웹 GUI
│   ├── public/        # 웹 인터페이스 파일  
│   ├── src/           # 서버 코드
│   └── README.md      # 상세 사용 가이드
├── Verifier/          # Credential 검증 서비스 + ⭐ 새로운 웹 GUI
│   ├── public/        # 현대적 웹 인터페이스 (NEW!)
│   ├── src/           # 서버 코드
│   └── README.md      # 상세 사용 가이드 (NEW!)
└── README.md          # 이 파일 - 전체 시스템 가이드
```

## ⚡ 빠른 시작 가이드

### 🔧 사전 요구사항

- Node.js 16+ 
- npm 또는 yarn
- 인터넷 연결 (Sepolia 테스트넷 접근용)

### 🚀 즉시 실행 방법

**1단계: Wallet 서비스 시작**
```bash
cd Wallet
node src\index.js
```
✅ 브라우저에서 http://localhost:3001/web 접속

**2단계: Issuer 서비스 시작** (새 터미널)
```bash
cd Issuer  
node src\index.js
```
✅ 브라우저에서 http://localhost:3002/web 접속

**3단계: Verifier 서비스 시작** (새 터미널)
```bash
cd Verifier
node src\index.js
```
✅ 브라우저에서 http://localhost:3003 접속 (⭐ **새로운 현대적 웹 GUI!**)

### 🎯 완전한 웹 인터페이스 체험

모든 세 서비스가 실행되면:
- **Wallet 웹 GUI**: http://localhost:3001/web
- **Issuer 웹 GUI**: http://localhost:3002/web  
- **Verifier 웹 GUI**: http://localhost:3003 ⭐ **Bootstrap 5.3 현대적 디자인**

### 🎯 실제 사용 시나리오

#### 시나리오: 대학 학위 증명서 발급 및 검증

**1단계: 지갑 생성 및 DID 등록**
1. http://localhost:3001/web 접속
2. "Generate New Wallet" 버튼 클릭 → 지갑 생성
3. DID 섹션에서 "Register New DID" 클릭 → DID 등록
4. 생성된 DID 주소 복사 (예: `did:ethr:sepolia:0x...`)

**2단계: 학위 증명서 발급**
1. http://localhost:3002/web 접속  
2. "Issue Credential" 버튼 클릭
3. 폼 작성:
   - **Subject DID**: 1단계에서 복사한 DID 주소 입력
   - **Credential Type**: "University Degree" 선택
   - **University**: 대학명 입력 (예: "Seoul National University")
   - **Degree**: 학위명 입력 (예: "Bachelor of Computer Science") 
   - **Graduation Date**: 졸업일 선택
   - **GPA**: 학점 입력 (예: "4.2")
4. "Issue Credential" 버튼 클릭 → 증명서 발급

**3단계: 증명서 검증** ⭐ **새로운 웹 GUI 사용**
1. http://localhost:3003 접속 (새로운 현대적 인터페이스!)
2. **"Credential 검증"** 탭 클릭
3. 2단계에서 발급된 credential JSON을 텍스트 영역에 붙여넣기
4. **"검증하기"** 버튼 클릭 → 즉시 검증 결과 확인
5. **실시간 통계** 및 **검증 히스토리**에서 결과 추적

### 🎨 새로운 Verifier 웹 GUI 특징
- **📊 실시간 대시보드**: 검증 통계 및 성공률 모니터링
- **🎯 탭 기반 인터페이스**: Credential, Presentation, DID 검증 분리
- **📝 검증 히스토리**: 모든 검증 결과 자동 기록 및 추적
- **🎨 현대적 디자인**: Bootstrap 5.3 + Font Awesome 아이콘
- **📱 반응형**: 모바일, 태블릿, 데스크톱 완벽 지원

## � 서비스별 상세 문서

각 서비스는 독립적인 README.md 파일로 상세한 사용법과 API 문서를 제공합니다:

### 📖 개별 서비스 문서
- **💼 [Wallet/README.md](./Wallet/README.md)**: 지갑 서비스 완전 가이드
  - DID 생성 및 관리, 키 관리, 백업/복원, QR 코드 지원
- **🏢 [Issuer/README.md](./Issuer/README.md)**: 발급 서비스 완전 가이드  
  - 4가지 credential 타입, 발급 프로세스, API 문서
- **🔍 [Verifier/README.md](./Verifier/README.md)**: 검증 서비스 완전 가이드 ⭐ **NEW**
  - 웹 GUI 사용법, API 문서, 검증 프로세스, 보안 가이드

### 🎯 어떤 문서를 읽어야 할까요?
- **🚀 빠른 시작**: 이 파일 (main README.md) 계속 읽기
- **📱 웹 GUI 사용법**: 각 서비스의 개별 README.md 참조
- **🔧 API 개발**: 각 서비스의 개별 README.md의 REST API 섹션
- **🐛 문제 해결**: 각 서비스의 개별 README.md의 문제 해결 섹션

## 🛠️ 서비스별 상세 기능

### 💼 Wallet Service (포트 3001)

**웹 인터페이스**: http://localhost:3001/web

**주요 기능:**
- ✅ 이더리움 지갑 생성 및 관리
- ✅ DID 등록 및 관리  
- ✅ ETH 잔액 조회
- ✅ 트랜잭션 히스토리
- ✅ DID Document 관리

**사용법:**
1. "Generate New Wallet" → 새 지갑 생성
2. "Register New DID" → DID 등록 (블록체인에 기록)
3. "View DID Document" → DID 정보 확인

### 🏢 Issuer Service (포트 3002)

**웹 인터페이스**: http://localhost:3002/web

**주요 기능:**
- ✅ 4가지 타입의 Verifiable Credential 발급
- ✅ 블록체인에 credential 저장
- ✅ 발급 히스토리 관리
- ✅ Credential 취소 기능

**지원하는 Credential 타입:**
1. **University Degree** (대학 학위)
2. **Identity Verification** (신원 확인)  
3. **Professional Certification** (전문 자격)
4. **Employment Verification** (고용 확인)

**사용법:**
1. "Issue Credential" 클릭
2. Subject DID 입력 (⚠️ 반드시 Wallet에서 등록된 DID)
3. Credential 타입 선택
4. 필요한 정보 입력 후 발급

### 🔍 Verifier Service (포트 3003) ⭐ **NEW WEB GUI**

**웹 인터페이스**: http://localhost:3003 또는 http://localhost:3003/web

**🎨 새로운 현대적 웹 인터페이스:**
- ✅ **탭 기반 UI**: Credential 검증, Presentation 검증, DID 검증
- ✅ **실시간 대시보드**: 검증 통계 및 성공률 모니터링
- ✅ **검증 히스토리**: 모든 검증 결과 기록 및 추적
- ✅ **반응형 디자인**: 모바일/태블릿/데스크톱 지원
- ✅ **Bootstrap 5.3**: 현대적이고 직관적인 UI/UX

**주요 기능:**
- ✅ **Verifiable Credential 검증**: JSON 형태의 credential 즉시 검증
- ✅ **Verifiable Presentation 검증**: 복합 presentation 무결성 검사
- ✅ **DID 검증**: DID 문서 유효성 및 접근성 확인
- ✅ **실시간 통계**: 검증 성공/실패 카운트 및 성공률
- ✅ **검증 결과 상세 표시**: 발급자, 주체, 타입, 발급일 등 모든 정보

**사용법:**
1. **Credential 검증**: "Credential 검증" 탭에서 JSON 입력 → 즉시 검증
2. **Presentation 검증**: "Presentation 검증" 탭에서 복합 증명서 검증
3. **DID 검증**: "DID 검증" 탭에서 DID 주소 유효성 확인
4. **통계 확인**: 실시간 검증 성공률 및 히스토리 모니터링

## ⚠️ 중요한 사용 순서

**올바른 순서:**
1. 먼저 Wallet에서 DID 등록
2. 그 다음 Issuer에서 credential 발급  
3. 마지막에 Verifier에서 검증

**❌ 흔한 오류:**
- DID를 등록하지 않고 credential 발급 시도
- 오류 메시지: "DID is not registered. Please register the DID first in the Wallet service."

## 🔧 설정 정보

### 현재 배포된 스마트 컨트랙트
- **네트워크**: Sepolia Testnet
- **DID Registry 주소**: `0x8e9AC2Cb14b6b07D31FAF803D8B6Bac6cDC75B75`
- **RPC URL**: `https://sepolia.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e`

### 환경 설정 파일들
각 서비스의 `.env` 파일에는 이미 필요한 설정이 완료되어 있습니다.

## 🐛 문제 해결

### 일반적인 문제들

**1. "DID does not exist" 오류**
- 해결: Wallet 서비스에서 먼저 DID를 등록하세요

**2. "Failed to fetch" 오류**  
- 해결: 해당 서비스가 실행 중인지 확인하세요

**3. "Insufficient funds" 오류**
- 해결: Sepolia 테스트넷 ETH가 필요합니다 (무료 faucet 사용)

**4. 서비스가 시작되지 않는 경우**
```bash
# Node.js 프로세스 종료 후 재시작
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
```

### 로그 확인
각 서비스의 터미널에서 실시간 로그를 확인할 수 있습니다:
- ✅ 성공: 녹색 체크마크와 성공 메시지
- ❌ 실패: 빨간색 X마크와 명확한 오류 메시지

## 🚀 고급 사용법

### API 직접 사용

**지갑 생성:**
```bash
curl -X POST http://localhost:3001/wallet/generate
```

**DID 등록:**
```bash
curl -X POST http://localhost:3001/did/register \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x..."}'
```

**Credential 발급:**
```bash
curl -X POST http://localhost:3002/api/credentials/issue \
  -H "Content-Type: application/json" \
  -d '{
    "subjectDID": "did:ethr:sepolia:0x...",
    "credentialType": "UniversityDegree",
    "credentialSubject": {
      "university": "Seoul National University",
      "degree": "Bachelor of Computer Science",
      "graduationDate": "2024-02-15",
      "gpa": "4.2"
    }
  }'
```

## 📞 지원

질문이나 문제가 있으시면:
1. 터미널의 로그 메시지 확인
2. 브라우저 개발자 도구(F12) 콘솔 확인  
3. GitHub Issues에 문제 보고

---

**⚡ 주의사항**: 
- 이 시스템은 데모 및 개발 목적으로 설계되었습니다
- Sepolia 테스트넷을 사용하므로 실제 가치가 없는 ETH를 사용합니다
- 프로덕션 환경에서 사용하기 전에 추가적인 보안 감사가 필요합니다

## 🔗 기술 스택

### 블록체인
- **Ethereum Sepolia Testnet**: 테스트 환경
- **Solidity 0.8.20**: 스마트 컨트랙트 언어
- **Hardhat**: 개발 및 배포 도구
- **Ethers.js 6.x**: 블록체인 상호작용

### 백엔드
- **Node.js**: 서버 런타임
- **Express.js**: 웹 프레임워크
- **CORS**: 크로스 오리진 요청 지원
- **Express Rate Limit**: API 요청 제한

### 프론트엔드
- **Bootstrap 5.3**: UI 프레임워크 (⭐ Verifier에서 최신 적용)
- **Font Awesome 6.4**: 아이콘 시스템 (⭐ Verifier에서 최신 적용)
- **Vanilla JavaScript**: 클라이언트 사이드 로직
- **Responsive Design**: 완전한 모바일 지원
- **실시간 API 연동**: RESTful API와 완벽 통합

### 암호화 및 보안
- **ECDSA secp256k1**: 디지털 서명
- **Keccak-256**: 해시 함수
- **JWT**: 인증 토큰 (선택적)

## 🏛️ 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Wallet Web    │    │   Issuer Web    │    │  Verifier Web   │
│   (Port 3001)   │    │   (Port 3002)   │    │   (Port 3003)   │
│   Bootstrap UI  │    │   Bootstrap UI  │    │ ⭐Bootstrap 5.3 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Wallet Service │    │  Issuer Service │    │ Verifier Service│
│    (Express)    │    │    (Express)    │    │    (Express)    │
│   + Static Web  │    │   + Static Web  │    │ + ⭐Static Web │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │   Sepolia Testnet       │
                    │   DID Registry Contract │
                    │ 0x8e9AC2Cb14b6b07D31... │
                    └─────────────────────────┘
```

### 🎨 UI/UX 개선사항
- **일관된 디자인**: 모든 서비스에서 Bootstrap 기반 통일된 UI
- **현대적 인터페이스**: Verifier에 최신 Bootstrap 5.3 적용
- **직관적 네비게이션**: 탭 기반 인터페이스로 기능 분리
- **실시간 피드백**: 로딩 상태, 성공/실패 알림
- **반응형 디자인**: 모든 화면 크기에서 완벽한 사용성

## 🔐 보안 모델

### DID 보안
- **블록체인 기반**: 모든 DID가 Ethereum에 불변 저장
- **소유권 증명**: 개인키로 DID 제어
- **탈중앙화**: 중앙 기관 없이 자체 주권적 신원

### Credential 보안  
- **암호화 서명**: 발급자의 개인키로 서명
- **무결성 보장**: 블록체인에 해시 저장으로 변조 방지
- **취소 메커니즘**: 실시간 취소 상태 확인
- **검증 가능**: 누구나 독립적으로 검증 가능

## 🧪 테스트 시나리오

### 기본 테스트
1. **지갑 및 DID 생성 테스트**
2. **학위 증명서 발급 테스트**  
3. **신원 확인서 발급 테스트**
4. **Credential 검증 테스트**
5. **Credential 취소 테스트**

### 고급 테스트
1. **다중 Credential 발급**
2. **Verifiable Presentation 생성**
3. **배치 검증**
4. **오류 처리 테스트**

## 🌐 네트워크 정보

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e
- **Explorer**: https://sepolia.etherscan.io/
- **Faucet**: https://sepoliafaucet.com/

### 배포된 컨트랙트
- **DID Registry**: `0x8e9AC2Cb14b6b07D31FAF803D8B6Bac6cDC75B75`
- **배포 날짜**: 2025년 10월
- **검증 상태**: Etherscan에서 확인됨

## � 모니터링

### 헬스 체크
```bash
# 각 서비스 상태 확인
curl http://localhost:3001/health  # Wallet
curl http://localhost:3002/health  # Issuer  
curl http://localhost:3003/health  # Verifier
```

### 통계 조회
```bash
# 발급된 credential 수
curl http://localhost:3002/api/issuer/stats

# 검증 횟수
curl http://localhost:3003/api/verifier/stats
```

## 🔄 업데이트 및 유지보수

### 서비스 재시작
```bash
# 모든 Node.js 프로세스 종료
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# 각 서비스 개별 재시작
cd Wallet && node src\index.js
cd Issuer && node src\index.js  
cd Verifier && node src\index.js
```

### 데이터 백업
- **로컬 데이터**: 각 서비스의 메모리 기반 저장
- **블록체인 데이터**: Sepolia 네트워크에 영구 저장
- **권장**: 중요한 개인키는 별도 보안 저장

## 📝 라이센스 및 기여

### 라이센스
이 프로젝트는 MIT 라이센스 하에 제공됩니다.

### 기여 방법
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch  
5. Create a Pull Request

### 개발 가이드라인
- **코드 스타일**: JavaScript Standard Style
- **커밋 메시지**: Conventional Commits
- **테스트**: 새 기능에는 테스트 포함
- **문서화**: README 업데이트 필수

---

**� 체크리스트**

사용하기 전에 확인하세요:
- [ ] Node.js 16+ 설치됨
- [ ] 인터넷 연결 (Sepolia 접근용)
- [ ] 3개 터미널 준비 (각 서비스용)
- [ ] 브라우저 준비 (웹 인터페이스용)

**🎯 목표 달성 순서:**
1. [ ] Wallet에서 지갑 생성
2. [ ] Wallet에서 DID 등록  
3. [ ] Issuer에서 credential 발급
4. [ ] Verifier에서 credential 검증

성공하면 완전한 DID 생태계 경험을 하게 됩니다! 🎉