# Painel Instagram Bluum

- **Link:** https://claude.ai/artifact/61AikGiPMCodm7XJBbZXL4 (privado; para a equipe ver ou editar, use o menu Compartilhar do painel)
- **Arquivo-fonte:** `painel/painel-instagram.html`. Para republicar no mesmo link, passe a `url` acima na ferramenta Artifact.
- **Banco do painel** (ferramenta ArtifactData, `url` acima):
  - `posts/<id>`: título, date (AAAA-MM-DD) ou rel (dias em relação à inauguração), hora, formato (reels|carrossel|stories|post), pilar, fase, status (ideia|planejado|gravando|pronto|postado), objetivo, gancho, roteiro[], legenda, hashtags, precisa[], feitos[] (índices dos passos marcados), notas.
  - `config/geral`: { inauguracao: "AAAA-MM-DD" | null }
  - `resultados/<segunda-feira AAAA-MM-DD>`: seguidores, alcance, naoSeguidores, visitas, compartilhamentos, salvamentos, listaVip.
- O calendário inicial veio de `data/calendario.json` (carregado em 21/10/2026). Depois disso, a fonte da verdade é o painel.
