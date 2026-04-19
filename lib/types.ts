export type SessionUser = {
  id: string;
  login: string;
  nome: string;
  isAdmin: boolean;
};

export type UserRow = {
  id: string;
  login: string;
  nome: string;
  pass: string;
  created_at?: string;
};

export type FlagRow = {
  id: string;
  numero: number;
  user_id: string;
  value: string;
};

export type SubmissionRow = {
  id: string;
  user_id: string;
  flag_id: string;
  submitted_value: string;
  correta: boolean;
  created_at?: string;
};

export type FlagCatalogRow = {
  numero: number;
  titulo: string;
  descricao: string;
  pontos: number;
  ativa: boolean;
  updated_at?: string;
};

export type FlagObservationRow = {
  id?: string;
  user_id: string;
  numero: number;
  observacao: string;
  updated_by: string;
  updated_at?: string;
};

export type CompetitorFlagView = {
  id: string;
  numero: number;
  titulo: string;
  descricao: string;
  pontos: number;
  ativa: boolean;
  resolvida: boolean;
  tentativasTotais: number;
  tentativasErradas: number;
  ultimaSubmissaoEm: string | null;
};

export type CompetitorDashboardData = {
  user: SessionUser;
  totalScore: number;
  solvedCount: number;
  totalAttempts: number;
  lastSolvedAt: string | null;
  flags: CompetitorFlagView[];
};

export type RankingFlagCell = {
  numero: number;
  pontos: number;
  resolvida: boolean;
  tentativasErradas: number;
  resolvidaEm: string | null;
};

export type RankingEntry = {
  userId: string;
  nome: string;
  login: string;
  score: number;
  solvedCount: number;
  totalAttempts: number;
  totalWrongAttempts: number;
  lastSolvedAt: string | null;
  flags: RankingFlagCell[];
};

export type AdminUserFlagStatus = {
  numero: number;
  titulo: string;
  pontos: number;
  resolvida: boolean;
  tentativasTotais: number;
  tentativasErradas: number;
  ultimaSubmissaoEm: string | null;
  observacao: string;
};

export type AdminUserOverview = {
  id: string;
  nome: string;
  login: string;
  score: number;
  solvedCount: number;
  flags: AdminUserFlagStatus[];
};

export type AdminFlagDetailRow = {
  userId: string;
  nome: string;
  login: string;
  resolvida: boolean;
  tentativasTotais: number;
  tentativasErradas: number;
  ultimaSubmissaoEm: string | null;
  observacao: string;
};

export type ImportPreview = {
  usersCount: number;
  flagsCount: number;
  numeros: number[];
};

export type CompetitionRow = {
  id: string;
  started_at: string;
  ends_at: string;
  finished_at: string | null;
  created_by: string;
  updated_by: string;
  created_at?: string;
  updated_at?: string;
};

export type CompetitionStatus = {
  exists: boolean;
  isRunning: boolean;
  hasOpenCompetition: boolean;
  startedAt: string | null;
  endsAt: string | null;
  finishedAt: string | null;
};