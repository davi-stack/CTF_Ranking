import { supabase } from "@/lib/supabase";
import type {
  AdminFlagDetailRow,
  AdminUserOverview,
  CompetitionRow,
  CompetitionStatus,
  CompetitorDashboardData,
  FlagCatalogRow,
  FlagObservationRow,
  FlagRow,
  RankingEntry,
  SessionUser,
  SubmissionRow,
  UserRow,
} from "@/lib/types";

function fallbackCatalogFromFlags(flags: Pick<FlagRow, "numero">[]): FlagCatalogRow[] {
  return [...new Set(flags.map((flag) => flag.numero))]
    .sort((a, b) => a - b)
    .map((numero) => ({
      numero,
      titulo: `Flag ${numero}`,
      descricao: `Desafio ${numero}. Atualize esta descrição no painel administrativo.`,
      pontos: Math.max(100, numero * 100),
      ativa: true,
    }));
}

async function getUsers() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nome, login, pass, created_at")
    .order("nome", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as UserRow[]).filter((user) => user.login.toLowerCase() !== "admin");
}

async function getFlagsForUsers() {
  const { data, error } = await supabase.from("flags").select("id, numero, user_id, value");
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as FlagRow[];
}

async function getCatalog(flags: FlagRow[]) {
  const { data, error } = await supabase
    .from("flag_catalog")
    .select("numero, titulo, descricao, pontos, ativa, updated_at")
    .order("numero", { ascending: true });

  if (error || !data || data.length === 0) {
    return fallbackCatalogFromFlags(flags);
  }

  return data as FlagCatalogRow[];
}

async function getSubmissions() {
  const { data, error } = await supabase
    .from("submissoes")
    .select("id, user_id, flag_id, submitted_value, correta, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SubmissionRow[];
}

async function getObservations() {
  const { data, error } = await supabase
    .from("flag_observacoes")
    .select("id, user_id, numero, observacao, updated_by, updated_at");

  if (error || !data) {
    return [] as FlagObservationRow[];
  }

  return data as FlagObservationRow[];
}

function getObservationMap(observations: FlagObservationRow[]) {
  return new Map(observations.map((item) => [`${item.user_id}:${item.numero}`, item.observacao]));
}

export async function getCompetitionStatus(): Promise<CompetitionStatus> {
  const { data, error } = await supabase
    .from("ctf_competitions")
    .select("id, started_at, ends_at, finished_at, created_by, updated_by, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return {
      exists: false,
      isRunning: false,
      hasOpenCompetition: false,
      startedAt: null,
      endsAt: null,
      finishedAt: null,
    };
  }

  const latest = data[0] as CompetitionRow;
  const now = Date.now();
  const finishedAtTs = latest.finished_at ? new Date(latest.finished_at).getTime() : null;
  const endsAtTs = new Date(latest.ends_at).getTime();

  const hasOpenCompetition = finishedAtTs === null;
  const isRunning = finishedAtTs === null && now < endsAtTs;

  return {
    exists: true,
    isRunning,
    hasOpenCompetition,
    startedAt: latest.started_at,
    endsAt: latest.ends_at,
    finishedAt: latest.finished_at,
  };
}

export async function getCompetitorDashboard(user: SessionUser): Promise<CompetitorDashboardData> {
  const [flags, submissions] = await Promise.all([getFlagsForUsers(), getSubmissions()]);
  const catalog = await getCatalog(flags);

  const userFlags = flags.filter((flag) => flag.user_id === user.id);
  const userFlagMap = new Map(userFlags.map((flag) => [flag.numero, flag]));
  const submissionMap = submissions.filter((item) => item.user_id === user.id);

  let totalScore = 0;
  let solvedCount = 0;
  let lastSolvedAt: string | null = null;

  const dashboardFlags = catalog.map((catalogFlag) => {
    const boundFlag = userFlagMap.get(catalogFlag.numero);
    const attempts = boundFlag
      ? submissionMap.filter((submission) => submission.flag_id === boundFlag.id)
      : [];
    const solvedSubmission = attempts.find((submission) => submission.correta);
    const wrongAttempts = attempts.filter((submission) => !submission.correta).length;

    if (solvedSubmission) {
      totalScore += catalogFlag.pontos;
      solvedCount += 1;
      lastSolvedAt = solvedSubmission.created_at ?? lastSolvedAt;
    }

    return {
      id: boundFlag?.id ?? `${user.id}-${catalogFlag.numero}`,
      numero: catalogFlag.numero,
      titulo: catalogFlag.titulo,
      descricao: catalogFlag.descricao,
      pontos: catalogFlag.pontos,
      ativa: catalogFlag.ativa,
      resolvida: Boolean(solvedSubmission),
      tentativasTotais: attempts.length,
      tentativasErradas: wrongAttempts,
      ultimaSubmissaoEm: attempts.at(-1)?.created_at ?? null,
    };
  });

  return {
    user,
    totalScore,
    solvedCount,
    totalAttempts: submissionMap.length,
    lastSolvedAt,
    flags: dashboardFlags,
  };
}

export async function getRankingData(): Promise<RankingEntry[]> {
  const [users, flags, submissions] = await Promise.all([getUsers(), getFlagsForUsers(), getSubmissions()]);
  const catalog = await getCatalog(flags);
  const flagsByUserAndNumber = new Map(flags.map((flag) => [`${flag.user_id}:${flag.numero}`, flag]));

  const ranking = users.map<RankingEntry>((user) => {
    const userSubmissions = submissions.filter((submission) => submission.user_id === user.id);
    let score = 0;
    let solvedCount = 0;
    let totalWrongAttempts = 0;
    let lastSolvedAt: string | null = null;

    const flagCells = catalog.map((catalogFlag) => {
      const boundFlag = flagsByUserAndNumber.get(`${user.id}:${catalogFlag.numero}`);
      const attempts = boundFlag
        ? userSubmissions.filter((submission) => submission.flag_id === boundFlag.id)
        : [];
      const solvedSubmission = attempts.find((submission) => submission.correta);
      const wrongAttempts = attempts.filter((submission) => !submission.correta).length;

      if (solvedSubmission) {
        score += catalogFlag.pontos;
        solvedCount += 1;
        lastSolvedAt = solvedSubmission.created_at ?? lastSolvedAt;
      }

      totalWrongAttempts += wrongAttempts;

      return {
        numero: catalogFlag.numero,
        pontos: catalogFlag.pontos,
        resolvida: Boolean(solvedSubmission),
        tentativasErradas: wrongAttempts,
        resolvidaEm: solvedSubmission?.created_at ?? null,
      };
    });

    return {
      userId: user.id,
      nome: user.nome,
      login: user.login,
      score,
      solvedCount,
      totalAttempts: userSubmissions.length,
      totalWrongAttempts,
      lastSolvedAt,
      flags: flagCells,
    };
  });

  return ranking.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    if (b.solvedCount !== a.solvedCount) {
      return b.solvedCount - a.solvedCount;
    }

    if (a.totalWrongAttempts !== b.totalWrongAttempts) {
      return a.totalWrongAttempts - b.totalWrongAttempts;
    }

    if (a.lastSolvedAt && b.lastSolvedAt) {
      return new Date(a.lastSolvedAt).getTime() - new Date(b.lastSolvedAt).getTime();
    }

    if (a.lastSolvedAt) {
      return -1;
    }

    if (b.lastSolvedAt) {
      return 1;
    }

    return a.nome.localeCompare(b.nome, "pt-BR");
  });
}

export async function getAdminOverview(): Promise<{ catalog: FlagCatalogRow[]; users: AdminUserOverview[] }> {
  const [users, flags, submissions, observations] = await Promise.all([
    getUsers(),
    getFlagsForUsers(),
    getSubmissions(),
    getObservations(),
  ]);
  const catalog = await getCatalog(flags);
  const observationMap = getObservationMap(observations);
  const flagsByUserAndNumber = new Map(flags.map((flag) => [`${flag.user_id}:${flag.numero}`, flag]));

  const overview = users.map<AdminUserOverview>((user) => {
    const userSubmissions = submissions.filter((submission) => submission.user_id === user.id);
    let score = 0;
    let solvedCount = 0;

    const flagStatus = catalog.map((catalogFlag) => {
      const boundFlag = flagsByUserAndNumber.get(`${user.id}:${catalogFlag.numero}`);
      const attempts = boundFlag
        ? userSubmissions.filter((submission) => submission.flag_id === boundFlag.id)
        : [];
      const solvedSubmission = attempts.find((submission) => submission.correta);

      if (solvedSubmission) {
        score += catalogFlag.pontos;
        solvedCount += 1;
      }

      return {
        numero: catalogFlag.numero,
        titulo: catalogFlag.titulo,
        pontos: catalogFlag.pontos,
        resolvida: Boolean(solvedSubmission),
        tentativasTotais: attempts.length,
        tentativasErradas: attempts.filter((submission) => !submission.correta).length,
        ultimaSubmissaoEm: attempts.at(-1)?.created_at ?? null,
        observacao: observationMap.get(`${user.id}:${catalogFlag.numero}`) ?? "",
      };
    });

    return {
      id: user.id,
      nome: user.nome,
      login: user.login,
      score,
      solvedCount,
      flags: flagStatus,
    };
  });

  return { catalog, users: overview };
}

export async function getAdminFlagDetail(numero: number): Promise<{
  flag: FlagCatalogRow | null;
  users: AdminFlagDetailRow[];
}> {
  const [users, flags, submissions, observations] = await Promise.all([
    getUsers(),
    getFlagsForUsers(),
    getSubmissions(),
    getObservations(),
  ]);
  const catalog = await getCatalog(flags);
  const flag = catalog.find((item) => item.numero === numero) ?? null;
  const observationMap = getObservationMap(observations);
  const flagsByUser = new Map(flags.filter((item) => item.numero === numero).map((item) => [item.user_id, item]));

  const rows = users.map<AdminFlagDetailRow>((user) => {
    const boundFlag = flagsByUser.get(user.id);
    const attempts = boundFlag
      ? submissions.filter((submission) => submission.user_id === user.id && submission.flag_id === boundFlag.id)
      : [];
    const solvedSubmission = attempts.find((submission) => submission.correta);

    return {
      userId: user.id,
      nome: user.nome,
      login: user.login,
      resolvida: Boolean(solvedSubmission),
      tentativasTotais: attempts.length,
      tentativasErradas: attempts.filter((submission) => !submission.correta).length,
      ultimaSubmissaoEm: attempts.at(-1)?.created_at ?? null,
      observacao: observationMap.get(`${user.id}:${numero}`) ?? "",
    };
  });

  rows.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return { flag, users: rows };
}

export async function getFlagCatalogRows() {
  const flags = await getFlagsForUsers();
  return getCatalog(flags);
}