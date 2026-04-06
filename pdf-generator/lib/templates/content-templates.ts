import { Chapter, Visualization, Source } from '../types';

interface TopicTemplate {
  category: string;
  chapterTitles: string[];
  paragraphs: Record<'short' | 'medium' | 'long', string[]>;
  visualizations: Visualization[];
  sources: Source[];
}

const TEMPLATES: TopicTemplate[] = [
  {
    category: '비즈니스',
    chapterTitles: [
      '시장 분석과 기회 포착',
      '경쟁 우위 전략 수립',
      '고객 세분화와 타겟팅',
      '수익 모델 설계',
      '성장 전략과 확장',
      '리스크 관리와 대응',
      '팀 구성과 리더십',
      '재무 계획과 예산 관리',
    ],
    paragraphs: {
      short: [
        '현대 비즈니스 환경에서 시장 분석은 성공의 핵심 요소입니다. 데이터 기반 의사결정을 통해 정확한 시장 기회를 포착할 수 있으며, 이를 통해 경쟁사 대비 빠른 시장 진입이 가능합니다.',
        '효과적인 시장 분석을 위해서는 정량적 데이터와 정성적 인사이트를 모두 활용해야 합니다. 시장 규모, 성장률, 트렌드를 파악하고, 고객의 니즈와 페인포인트를 깊이 이해하는 것이 중요합니다.',
      ],
      medium: [
        '현대 비즈니스 환경에서 시장 분석은 성공의 핵심 요소입니다. 데이터 기반 의사결정을 통해 정확한 시장 기회를 포착할 수 있으며, 이를 통해 경쟁사 대비 빠른 시장 진입이 가능합니다.',
        '효과적인 시장 분석을 위해서는 정량적 데이터와 정성적 인사이트를 모두 활용해야 합니다. 시장 규모, 성장률, 트렌드를 파악하고, 고객의 니즈와 페인포인트를 깊이 이해하는 것이 중요합니다.',
        'PEST 분석(정치, 경제, 사회, 기술)을 통해 거시적 환경을 이해하고, SWOT 분석으로 자사의 강점과 약점을 객관적으로 평가해야 합니다. 이러한 체계적 접근은 리스크를 최소화하고 기회를 극대화합니다.',
        '최근 연구에 따르면, 데이터 기반 의사결정을 하는 기업은 그렇지 않은 기업 대비 평균 23% 높은 수익률을 기록하고 있습니다. 이는 체계적인 시장 분석의 중요성을 단적으로 보여주는 수치입니다.',
        '특히 디지털 트랜스포메이션 시대에는 실시간 데이터 수집과 분석 도구를 활용하여 시장 변화에 빠르게 대응하는 것이 경쟁 우위의 핵심입니다.',
      ],
      long: [
        '현대 비즈니스 환경에서 시장 분석은 성공의 핵심 요소입니다. 데이터 기반 의사결정을 통해 정확한 시장 기회를 포착할 수 있으며, 이를 통해 경쟁사 대비 빠른 시장 진입이 가능합니다. 글로벌 시장 조사 기관 IDC에 따르면, 2025년까지 전 세계 데이터 분석 시장은 연평균 12.3%의 성장률을 보일 것으로 예상됩니다.',
        '효과적인 시장 분석을 위해서는 정량적 데이터와 정성적 인사이트를 모두 활용해야 합니다. 시장 규모, 성장률, 트렌드를 파악하고, 고객의 니즈와 페인포인트를 깊이 이해하는 것이 중요합니다. 이를 위해 설문조사, 인터뷰, 포커스 그룹 등 다양한 연구 방법론을 병행하는 것이 좋습니다.',
        'PEST 분석(정치, 경제, 사회, 기술)을 통해 거시적 환경을 이해하고, SWOT 분석으로 자사의 강점과 약점을 객관적으로 평가해야 합니다. 이러한 체계적 접근은 리스크를 최소화하고 기회를 극대화합니다. 또한 Porter의 5Forces 모델을 활용하면 산업 내 경쟁 강도를 체계적으로 분석할 수 있습니다.',
        '최근 연구에 따르면, 데이터 기반 의사결정을 하는 기업은 그렇지 않은 기업 대비 평균 23% 높은 수익률을 기록하고 있습니다. 이는 체계적인 시장 분석의 중요성을 단적으로 보여주는 수치입니다. McKinsey Global Institute의 보고서는 데이터 분석 역량이 기업 성과에 미치는 영향을 아래와 같이 분석했습니다.',
        '특히 디지털 트랜스포메이션 시대에는 실시간 데이터 수집과 분석 도구를 활용하여 시장 변화에 빠르게 대응하는 것이 경쟁 우위의 핵심입니다. Google Analytics, Tableau, Power BI 등의 도구를 활용하면 대량의 데이터에서 의미 있는 인사이트를 도출할 수 있습니다.',
        '사례 연구: 넷플릭스는 시청 데이터를 분석하여 오리지널 콘텐츠 제작에 활용했습니다. "House of Cards"의 제작 결정은 시청자 행동 데이터 분석에 기반했으며, 이는 데이터 기반 의사결정의 대표적 성공 사례로 꼽힙니다.',
        '시장 분석의 핵심 지표로는 TAM(Total Addressable Market), SAM(Serviceable Addressable Market), SOM(Serviceable Obtainable Market)이 있습니다. 이 세 가지 지표를 통해 실현 가능한 시장 규모를 단계적으로 파악할 수 있으며, 투자자에게도 명확한 비전을 제시할 수 있습니다.',
        '결론적으로, 성공적인 비즈니스를 위해서는 체계적인 시장 분석 프레임워크를 구축하고, 지속적으로 데이터를 수집·분석하여 전략을 업데이트하는 것이 필수적입니다. 이는 일회성 활동이 아닌 지속적인 프로세스로 접근해야 합니다.',
      ],
    },
    visualizations: [
      {
        id: 'biz-1',
        type: 'bar-chart',
        title: '시장 규모 성장 추이',
        data: {
          labels: ['2022', '2023', '2024', '2025', '2026'],
          values: [120, 145, 178, 215, 260],
          unit: '억 원',
        },
      },
      {
        id: 'biz-2',
        type: 'pie-chart',
        title: '시장 점유율 분석',
        data: {
          labels: ['자사', '경쟁사 A', '경쟁사 B', '기타'],
          values: [35, 28, 22, 15],
        },
      },
    ],
    sources: [
      { id: 's1', title: 'Global Market Analysis Report 2024', author: 'McKinsey & Company', year: 2024, url: 'https://mckinsey.com' },
      { id: 's2', title: 'Digital Transformation Trends', author: 'IDC Research', year: 2024, url: 'https://idc.com' },
      { id: 's3', title: '데이터 기반 의사결정의 효과', author: 'Harvard Business Review', year: 2023 },
    ],
  },
  {
    category: '기술/IT',
    chapterTitles: [
      '기술 트렌드 개요',
      '인공지능과 머신러닝',
      '클라우드 컴퓨팅의 진화',
      '사이버보안 전략',
      '데이터 아키텍처 설계',
      '개발 방법론과 DevOps',
      '디지털 트랜스포메이션',
      '미래 기술 전망',
    ],
    paragraphs: {
      short: [
        '기술 산업은 전례 없는 속도로 발전하고 있습니다. AI, 클라우드, IoT 등의 기술이 융합되면서 새로운 비즈니스 모델과 서비스가 등장하고 있으며, 이러한 변화에 적응하는 것이 기업 생존의 핵심입니다.',
        '특히 생성형 AI의 등장은 소프트웨어 개발, 콘텐츠 제작, 고객 서비스 등 다양한 분야에서 혁신적인 변화를 가져오고 있습니다.',
      ],
      medium: [
        '기술 산업은 전례 없는 속도로 발전하고 있습니다. AI, 클라우드, IoT 등의 기술이 융합되면서 새로운 비즈니스 모델과 서비스가 등장하고 있으며, 이러한 변화에 적응하는 것이 기업 생존의 핵심입니다.',
        '특히 생성형 AI의 등장은 소프트웨어 개발, 콘텐츠 제작, 고객 서비스 등 다양한 분야에서 혁신적인 변화를 가져오고 있습니다. OpenAI, Google, Anthropic 등의 기업이 이끄는 AI 혁명은 산업 전반에 걸친 패러다임 전환을 예고합니다.',
        '클라우드 네이티브 아키텍처의 채택률은 매년 증가하고 있으며, 2026년까지 기업 워크로드의 75% 이상이 클라우드에서 실행될 것으로 예측됩니다.',
        'Kubernetes, 마이크로서비스, 서버리스 컴퓨팅의 조합은 현대적인 애플리케이션 개발의 표준이 되고 있습니다.',
        '사이버보안 위협 또한 진화하고 있어, 제로 트러스트 아키텍처와 AI 기반 보안 솔루션의 도입이 필수적입니다.',
      ],
      long: [
        '기술 산업은 전례 없는 속도로 발전하고 있습니다. AI, 클라우드, IoT 등의 기술이 융합되면서 새로운 비즈니스 모델과 서비스가 등장하고 있으며, 이러한 변화에 적응하는 것이 기업 생존의 핵심입니다.',
        '특히 생성형 AI의 등장은 소프트웨어 개발, 콘텐츠 제작, 고객 서비스 등 다양한 분야에서 혁신적인 변화를 가져오고 있습니다. OpenAI, Google, Anthropic 등의 기업이 이끄는 AI 혁명은 산업 전반에 걸친 패러다임 전환을 예고합니다.',
        '클라우드 네이티브 아키텍처의 채택률은 매년 증가하고 있으며, 2026년까지 기업 워크로드의 75% 이상이 클라우드에서 실행될 것으로 예측됩니다. AWS, Azure, GCP 3대 클라우드 플랫폼이 시장의 65%를 점유하고 있습니다.',
        'Kubernetes는 컨테이너 오케스트레이션의 표준으로 자리잡았으며, CNCF(Cloud Native Computing Foundation)에 따르면 전 세계 기업의 96%가 Kubernetes를 사용하거나 평가 중입니다.',
        '사이버보안 위협은 더욱 정교해지고 있습니다. 랜섬웨어 공격의 평균 피해 금액은 2023년 기준 540만 달러에 달하며, 기업들은 제로 트러스트 보안 모델 도입을 가속화하고 있습니다.',
        'DevOps와 SRE(Site Reliability Engineering) 문화의 확산은 소프트웨어 개발과 운영의 경계를 허물고 있습니다. CI/CD 파이프라인의 자동화는 배포 주기를 크게 단축시키고, 장애 대응 시간을 줄이는 데 기여합니다.',
        '양자 컴퓨팅, 에지 컴퓨팅, 5G/6G 네트워크 등 차세대 기술의 상용화도 가속화되고 있어, 향후 5년간 기술 산업은 또 한 번의 대전환을 맞이할 것입니다.',
        '결론적으로, 기술 리더들은 현재 기술 스택의 최적화와 동시에 신기술 도입을 위한 로드맵을 병행 수립해야 합니다. 이는 조직의 디지털 성숙도를 높이고 지속 가능한 경쟁력을 확보하는 데 필수적입니다.',
      ],
    },
    visualizations: [
      {
        id: 'tech-1',
        type: 'line-chart',
        title: 'AI 시장 성장 전망',
        data: {
          labels: ['2022', '2023', '2024', '2025', '2026'],
          values: [85, 125, 180, 270, 400],
          unit: '십억 달러',
        },
      },
      {
        id: 'tech-2',
        type: 'bar-chart',
        title: '클라우드 서비스 시장 점유율',
        data: {
          labels: ['AWS', 'Azure', 'GCP', 'Others'],
          values: [32, 23, 10, 35],
          unit: '%',
        },
      },
    ],
    sources: [
      { id: 's1', title: 'State of AI Report 2024', author: 'Stanford HAI', year: 2024 },
      { id: 's2', title: 'Cloud Computing Market Forecast', author: 'Gartner', year: 2024 },
      { id: 's3', title: 'Cybersecurity Threat Landscape', author: 'ENISA', year: 2024 },
    ],
  },
  {
    category: '마케팅',
    chapterTitles: [
      '디지털 마케팅 기초',
      'SEO와 콘텐츠 전략',
      '소셜 미디어 마케팅',
      '이메일 마케팅 자동화',
      '데이터 분석과 최적화',
      '브랜딩과 포지셔닝',
      '고객 여정 매핑',
      '마케팅 ROI 측정',
    ],
    paragraphs: {
      short: [
        '디지털 마케팅은 온라인 채널을 통해 고객과 소통하고 비즈니스 목표를 달성하는 핵심 전략입니다. SEO, 소셜 미디어, 콘텐츠 마케팅 등 다양한 채널을 통합적으로 운영하는 것이 중요합니다.',
        '효과적인 디지털 마케팅을 위해서는 데이터 분석 역량이 필수적이며, A/B 테스트와 전환률 최적화를 통해 지속적으로 성과를 개선해야 합니다.',
      ],
      medium: [
        '디지털 마케팅은 온라인 채널을 통해 고객과 소통하고 비즈니스 목표를 달성하는 핵심 전략입니다. SEO, 소셜 미디어, 콘텐츠 마케팅 등 다양한 채널을 통합적으로 운영하는 것이 중요합니다.',
        '검색 엔진 최적화(SEO)는 유기적 트래픽을 확보하는 가장 비용 효율적인 방법입니다. 키워드 리서치, 온페이지 최적화, 백링크 구축 등 체계적인 SEO 전략이 필요합니다.',
        '소셜 미디어 마케팅에서는 각 플랫폼의 특성을 이해하고 타겟 고객이 활동하는 채널에 집중하는 것이 중요합니다. Instagram은 비주얼 콘텐츠에, LinkedIn은 B2B 마케팅에 특히 효과적입니다.',
        '콘텐츠 마케팅은 가치 있는 정보를 제공하여 고객의 신뢰를 구축하는 장기적 전략입니다. 블로그, 영상, 인포그래픽 등 다양한 형식의 콘텐츠를 활용합니다.',
        '마케팅 ROI 측정을 위해 Google Analytics, HubSpot 등의 도구를 활용하고, CAC(고객 획득 비용)와 LTV(고객 생애 가치) 등 핵심 지표를 추적해야 합니다.',
      ],
      long: [
        '디지털 마케팅은 온라인 채널을 통해 고객과 소통하고 비즈니스 목표를 달성하는 핵심 전략입니다.',
        '검색 엔진 최적화(SEO)는 유기적 트래픽을 확보하는 가장 비용 효율적인 방법입니다.',
        '소셜 미디어 마케팅에서는 각 플랫폼의 특성을 이해하고 타겟 고객이 활동하는 채널에 집중하는 것이 중요합니다.',
        '콘텐츠 마케팅은 가치 있는 정보를 제공하여 고객의 신뢰를 구축하는 장기적 전략입니다.',
        '이메일 마케팅 자동화를 통해 고객의 행동에 기반한 맞춤형 메시지를 전달할 수 있습니다. 웰컴 시리즈, 장바구니 이탈 알림, 재구매 유도 등 다양한 시나리오를 자동화하면 전환율을 크게 향상시킬 수 있습니다.',
        '데이터 분석은 마케팅 의사결정의 핵심입니다. UTM 파라미터, 퍼널 분석, 코호트 분석 등을 통해 각 채널과 캠페인의 성과를 정밀하게 측정할 수 있습니다.',
        '브랜딩은 단순한 로고나 디자인이 아닌, 고객의 마음속에 자리잡는 인식과 감정의 총체입니다. 일관된 브랜드 경험을 모든 접점에서 제공하는 것이 핵심입니다.',
        '결론적으로, 성공적인 디지털 마케팅은 데이터 기반 의사결정, 고객 중심 사고, 지속적 실험과 최적화의 조합입니다.',
      ],
    },
    visualizations: [
      {
        id: 'mkt-1',
        type: 'bar-chart',
        title: '채널별 마케팅 ROI',
        data: {
          labels: ['SEO', '이메일', 'SNS', 'PPC', '콘텐츠'],
          values: [5.3, 4.2, 2.8, 2.0, 3.5],
          unit: 'x',
        },
      },
    ],
    sources: [
      { id: 's1', title: 'State of Marketing 2024', author: 'HubSpot', year: 2024 },
      { id: 's2', title: 'Digital Marketing Benchmarks', author: 'SEMrush', year: 2024 },
    ],
  },
];

export function getTemplateByCategory(category: string): TopicTemplate | undefined {
  return TEMPLATES.find((t) => t.category === category);
}

export function getAllCategories(): string[] {
  return TEMPLATES.map((t) => t.category);
}

export function generateChapters(category: string, length: 'short' | 'medium' | 'long'): Chapter[] {
  const template = getTemplateByCategory(category);
  if (!template) return [];

  return template.chapterTitles.map((title, i) => ({
    id: crypto.randomUUID(),
    title,
    order: i,
    content: template.paragraphs[length].join('\n\n'),
    length,
    visualizations: i === 0 ? template.visualizations : [],
    sources: i === 0 ? template.sources : [],
  }));
}

export { TEMPLATES };
