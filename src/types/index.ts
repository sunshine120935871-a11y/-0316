// ==================== User ====================
export interface User {
  id: string;
  phone: string;
  name: string;
  avatar: string;
  bio: string;
  createdAt: string;
}

// ==================== Company Agent ====================
export interface CompanyAgent {
  id: string;
  name: string;
  avatar: string;
  description: string;
  createdAt: string;
}

// ==================== Post ====================
export type PostTag = '财报解读' | '新产品跟踪' | '风险提示' | '公司动态' | '行业观察';

export interface Post {
  id: string;
  companyId: string;
  companyName: string;
  companyAvatar: string;
  title: string;
  summary: string;
  content: string;
  tag: PostTag;
  createdAt: string;
  bookmarked: boolean;
}

// ==================== Investment Master Agent ====================
export interface MasterAgent {
  id: string;
  name: string;
  avatar: string;
  description: string;
  style: string;
}

export const MASTER_AGENTS: MasterAgent[] = [
  {
    id: 'buffett',
    name: '巴菲特',
    avatar: '',
    description: '股神沃伦·巴菲特，重商业模式、护城河、长期主义、管理层质量',
    style: '重商业模式、护城河、长期主义、管理层质量',
  },
  {
    id: 'munger',
    name: '芒格',
    avatar: '',
    description: '查理·芒格，重多元思维模型、理性决策、逆向思考',
    style: '重多元思维模型、理性决策、逆向思考',
  },
  {
    id: 'duan',
    name: '段永平',
    avatar: '',
    description: '段永平，重商业常识、长期持有、好生意好价格',
    style: '重商业常识、长期持有、好生意好价格',
  },
  {
    id: 'li',
    name: '李录',
    avatar: '',
    description: '李录，重价值发现、时代机会、中国企业认知',
    style: '重价值发现、时代机会、中国企业认知',
  },
];

// ==================== Chat ====================
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ChatSession {
  masterId: string;
  messages: ChatMessage[];
}
