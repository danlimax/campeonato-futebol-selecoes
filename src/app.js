import express from "express";

const app = express();


app.use(express.json());

let times = [];
let partidas = [];

app.post("/adicionartime", (req, res) => {
  const time = req.body;
  const goleiros = time.jogadores.filter(
    (jogador) => jogador.posicao === "goleiro"
  );
  if (goleiros.length !== 3) {
    return res.status(400).send("Cada time deve ter exatamente 3 goleiros.");
  }
  if (time.jogadores.length !== 23) {
    return res.status(400).send("Cada time deve ter exatamente 23 jogadores.");
  }
  times.push(time);
  res.status(201).send("Time adicionado com sucesso!");
});

app.get("/times", (req, res) => {
  res.status(200).json(times);
});

app.post("/adicionarpartida", (req, res) => {
  const partida = req.body;
  const time1 = times.find((time) => time.nome === partida.time1);
  const time2 = times.find((time) => time.nome === partida.time2);
  if (!time1 || !time2) {
    return res
      .status(400)
      .send(
        "Ambos os times devem estar cadastrados antes de uma partida ser marcada."
      );
  }
  partidas.push(partida);
  res.status(201).send("Partida marcada com sucesso!");
});

app.get("/parditas", (req, res) => {
  res.status(200).json(partidas);
});

app.get("/partidas/:nomeDoTime", (req, res) => {
  const timePartidas = partidas.filter(
    (partida) =>
      partida.time1 === req.params.nomeDoTime ||
      partida.time2 === req.params.nomeDoTime
  );
  res.status(200).json(timePartidas);
});

app.put("/partidas/:id", (req, res) => {
  const partida = partidas.find((partida) => partida.id === req.params.id);
  if (!partida) {
    return res.status(404).send("Partida não encontrada.");
  }
  partida.gols = req.body.gols;
  partida.quemMarcou = req.body.quemMarcou;
  partida.selecaoVencedora = req.body.selecaoVencedora;
  res.status(200).send("Detalhes da partida atualizados com sucesso!");
});

app.get("/artilheiro", (req, res) => {
  let artilheiro = null;
  let maximoDeGols = 0;
  for (const team of times) {
    for (const jogador of team.jogadores) {
      if (jogador.gols > maximoDeGols) {
        maximoDeGols = jogador.gols;
        artilheiro = jogador;
      }
    }
  }
  res.status(200).json(artilheiro);
});

app.get("/campeao", (req, res) => {
  const partidaFinal = partidas.find((partida) => partida.rodada === "final");
  if (!partidaFinal) {
    return res.status(400).send("A final ainda não foi jogada.");
  }
  res.status(200).send(`O campeão é ${partidaFinal.ganhador}`);
});

export default app;
