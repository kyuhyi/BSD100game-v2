# n8n 에러 자동 복구 에이전트 (Self-Healing Workflow) 설정 가이드

## 워크플로우 개요

이 워크플로우는 n8n에서 에러가 발생했을 때 AI 에이전트(Anthropic Claude)가 자동으로:
1. 에러를 감지하고 로그를 기록
2. 워크플로우 구조를 분석
3. 웹 검색으로 해결책을 탐색
4. 노드 파라미터를 수정
5. 워크플로우를 재실행
6. 결과를 Telegram/Slack으로 알림

하는 **완전 자동화된 Self-Healing 시스템**입니다.

---

## 노드 구조

```
Error Trigger → Append row in sheet → If → AI Agent → Telegram / Slack
                                              │
                                    ┌─────────┼──────────┐
                                    │         │          │
                              [Chat Model] [Memory]  [Tools x6]
                              (Claude 4.6)  (Buffer)    │
                                                   ┌────┼────┐────┐────┐────┐
                                                   │    │    │    │    │    │
                                              getWF  update list  getEx retry web
                                                     Node  WFs       Exec Search
```

---

## 임포트 방법

1. n8n 대시보드를 엽니다
2. 좌측 메뉴에서 **Workflows** 클릭
3. 우측 상단 **⋮ (더보기)** → **Import from File** 클릭
4. `n8n-error-recovery-agent.json` 파일을 선택
5. 또는 JSON 내용을 복사 후 **Import from Paste** 사용

---

## 필수 Credentials 설정

### 1. n8n API Key (가장 중요)

n8n의 Self-API 접근을 위해 필요합니다.

1. n8n 대시보드 → **Settings** → **API** → **Create API Key**
2. 생성된 키를 복사
3. n8n **Credentials** → **New Credential** → **Header Auth**
4. 설정:
   - **Name**: `n8n API Key`
   - **Header Name**: `X-N8N-API-KEY`
   - **Header Value**: `발급받은_API_키`
5. JSON 파일 내 `N8N_API_CREDENTIAL_ID`를 생성된 credential ID로 교체

**Base URL 설정:**
- 환경 변수 `N8N_BASE_URL`을 설정하거나
- JSON 내 `https://bsd.ai.kr`을 본인의 n8n 도메인으로 변경

### 2. Anthropic API Key

1. [Anthropic Console](https://console.anthropic.com/)에서 API 키 발급
2. n8n **Credentials** → **New Credential** → **Anthropic**
3. API Key 입력
4. JSON 내 `ANTHROPIC_CREDENTIAL_ID`를 생성된 credential ID로 교체

### 3. Tavily API Key (웹 검색용)

1. [tavily.com](https://tavily.com)에서 회원가입 (무료 플랜 가능)
2. API Key 발급
3. n8n **Credentials** → **New Credential** → **Header Auth**
4. 설정:
   - **Name**: `Tavily API Key`
   - **Header Name**: `api-key`
   - **Header Value**: `발급받은_Tavily_API_키`
5. JSON 내 `TAVILY_API_CREDENTIAL_ID`를 생성된 credential ID로 교체

### 4. Google Sheets (에러 로그 기록용)

1. n8n **Credentials** → **New Credential** → **Google Sheets OAuth2**
2. Google Cloud Console에서 OAuth2 설정 후 연결
3. 에러 로그용 Google Sheet 생성 (컬럼: timestamp, workflow_id, workflow_name, execution_id, error_node, error_message, status)
4. 환경 변수 `GOOGLE_SHEET_ID`에 시트 ID 설정
5. JSON 내 `GOOGLE_SHEETS_CREDENTIAL_ID`를 생성된 credential ID로 교체

### 5. Telegram (알림용, 선택)

1. [@BotFather](https://t.me/BotFather)에서 봇 생성 후 토큰 발급
2. n8n **Credentials** → **New Credential** → **Telegram**
3. Bot Token 입력
4. 환경 변수 `TELEGRAM_CHAT_ID`에 채팅 ID 설정
5. JSON 내 `TELEGRAM_CREDENTIAL_ID`를 생성된 credential ID로 교체

### 6. Slack (알림용, 선택)

1. Slack App 생성 → OAuth Token 발급
2. n8n **Credentials** → **New Credential** → **Slack**
3. Access Token 입력
4. 환경 변수 `SLACK_CHANNEL_ID`에 채널 ID 설정
5. JSON 내 `SLACK_CREDENTIAL_ID`를 생성된 credential ID로 교체

---

## Credential ID 교체 목록

JSON 파일에서 아래 placeholder들을 실제 credential ID로 교체하세요:

| Placeholder | 설명 | 사용 노드 |
|---|---|---|
| `N8N_API_CREDENTIAL_ID` | n8n API 인증 | getWorkflow, updateNodeParam, listWorkflows, getExecution, retryExecution |
| `ANTHROPIC_CREDENTIAL_ID` | Claude AI 모델 | Anthropic Chat Model |
| `TAVILY_API_CREDENTIAL_ID` | 웹 검색 API | webSearch |
| `GOOGLE_SHEETS_CREDENTIAL_ID` | 구글 시트 | Append row in sheet |
| `TELEGRAM_CREDENTIAL_ID` | 텔레그램 봇 | Send a text message |
| `SLACK_CREDENTIAL_ID` | 슬랙 메시지 | Send a message |

---

## 환경 변수 설정

n8n Settings → Environment Variables에서 설정:

```
N8N_BASE_URL=https://your-n8n-domain.com
GOOGLE_SHEET_ID=your_google_sheet_id
TELEGRAM_CHAT_ID=your_telegram_chat_id
SLACK_CHANNEL_ID=your_slack_channel_id
```

---

## 주의사항

### 무한 루프 방지
- AI Agent의 `maxIterations`가 **5회**로 제한되어 있습니다
- If 노드에서 "self-healing" 키워드가 포함된 에러와 retry 실행을 필터링합니다
- 이 워크플로우 자체의 에러는 처리하지 않도록 Error Workflow 설정을 비워둡니다

### 보안
- n8n API Key는 워크플로우 수정 권한이 있으므로 안전하게 관리하세요
- AI Agent 시스템 프롬프트에 민감 정보 미기록 규칙이 포함되어 있습니다

### 권장 사항
- 처음에는 테스트 워크플로우에서만 작동하도록 If 조건을 추가하세요
- 프로덕션 적용 전 충분한 테스트를 진행하세요
- 에러 로그 Google Sheet를 주기적으로 모니터링하세요

---

## 에이전트 동작 흐름 (상세)

```
1. [Error Trigger] 에러 감지
        ↓
2. [Google Sheets] 에러 로그 기록 (timestamp, workflow, error info)
        ↓
3. [If] 조건 확인:
   - self-healing 관련 에러가 아닌지?
   - retry 실행이 아닌지?
   → 조건 불충족 시 종료 (무한 루프 방지)
        ↓
4. [AI Agent] Claude가 분석 시작:
   a. getWorkflow → 워크플로우 JSON 구조 확인
   b. getExecution → 실행 로그 상세 확인
   c. webSearch → 에러 해결책 검색 (필요시)
   d. updateNodeParam → 문제 노드 파라미터 수정
   e. retryExecution → 수정된 워크플로우 재실행
        ↓
5. [Telegram / Slack] 처리 결과 알림 전송
```
