import { SubmitFlagForm } from "@/components/ctf/SubmitFlagForm";
import { requireSessionUser } from "@/lib/auth";
import { getCompetitorDashboard } from "@/lib/ctf-data";

export default async function SubmitPage() {
  const user = await requireSessionUser();
  const dashboard = await getCompetitorDashboard(user);

  return (
    <SubmitFlagForm
      flags={dashboard.flags.map((flag) => ({
        numero: flag.numero,
        titulo: flag.titulo,
        descricao: flag.descricao,
        pontos: flag.pontos,
        ativa: flag.ativa,
        resolvida: flag.resolvida,
      }))}
    />
  );
}
