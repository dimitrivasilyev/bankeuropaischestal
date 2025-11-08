// Versão 1.2
const express = require("express");
const session = require("express-session"); // https://www.npmjs.com/package/express-session
const path = require("path");
const db = require("./db");

const port = 3000;
const host = "127.0.0.1";
const app = express();

// requisições: método, URL e horário
function verRequisicoes(req, res, next) {
  const agora = new Date().toISOString();
  console.log(
    `[\x1b[33m${agora}\x1b[39m] Requisição recebida: \x1b[1m${req.method}\x1b[0m \x1b[32m${req.url}\x1b[39m`
  );
  console.log("\x1b[1;33mCorpo da requisição\x1b[0;39m:", req.headers);
  next();
}

// se usuario tiver sessão procede, senão envia 401 HTTP
function verificaLogin(req, res, next) {
  if (!req.session.usuario) {
    console.log(
      req.session.usuario,
      "\x1b[1;31m--> sessão não criada\x1b[0;39m"
    );
    return res
      .status(401)
      .sendFile(path.join(__dirname, "public", "http401.html"));
  }
  next();
}

app.disable("x-powered-by"); // tira o parâmetro, que fala sobre informações do servidor
app.use(express.urlencoded({ extended: true })); // reconhece strings ou arrays vindos como dados de requisições
app.use(express.static(path.join(__dirname, "public"))); // configura express para acessar arquivos CSS, JS e HTML na pasta "public" (usando path para facilitar o caminho)
//app.use(verRequisicoes); // requisições: método, URL e horário

// configuração da sessão
app.use(
  session({
    secret: "testesegre123", // utilizado HMAC-256 para assinar o ID da sessão
    name: "sessionID", // nome da sessão
    resave: false, // não salva a sessão se nada mudou
    saveUninitialized: false, // não cria sessão até que algo seja salvo
    cookie: {
      maxAge: 1000 * 60 * 5, // 5 minutos de sessão
      httpOnly: true, // evita acesso via JS (protege contra XSS)
      secure: false, // true só em produção com HTTPS
    },
  })
);



// caminho de login
app.post("/login", async (req, res) => {
  // console.log("\x1b[1;33mLOGIN Request\x1b[0;39m:", req.headers); // ver as requisições LOGIN
  // console.log("\x1b[1;33mLOGIN Payload\x1b[0;39m:", req.body);
  // console.log(req.body.email);
  // console.log(req.body.passwd);
  const usuario = await db.login(req.body.email, req.body.passwd); // verifica se existe um usuario, com essa senha e email
  if (!usuario) {
    // se não existir nenhum dado, nas colunas email e senha, não existe esse usuário
    res.status(404).sendFile(path.join(__dirname, "public", "http404.html"));
    console.log("NÃO EXISTE");
  }
  // caso ao contrario, redireciona o usuario à página principal do banco
  else {
    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      saldo: usuario.saldo,
    };
    console.log(req.session.usuario, "\x1b[1;32m--> sessão criada\x1b[0;39m"); // mostra o usuário cuja sessão foi criada
    res.status(200).redirect("/conta"); // redireciona para a página de conta do usuário
  }
});

app.get("/teste/:email", async (req, res, next) => {
  const usuario = await db.returnID(req.params.email);
  res.json(usuario.id);
});

// caminho para cadastrar novos usuários
app.post("/enviar-cadastro", async (req, res) => {
  req.body.saldo = 0; // considera automaticamente o saldo do usuário como nulo
  // console.log(req.body); // exibe o corpo da requisão de cadastro do usuário
  // console.log(req.body.email);
  if ((await db.insertUsuario(req.body)) == 0) {
    return res
      .status(500)
      .sendFile(path.join(__dirname, "public", "http500.html"));
  } // código SQL para inserir o usuario
  await db.insertUsuario(req.body);
  id = await db.returnID(req.body.email);
  req.session.usuario = {
    id: id.id,
    nome: req.body.nome,
    saldo: req.body.saldo,
  };
  return res.redirect("/conta"); // redireciona o usuário para a página de sua conta
});

// API para a página "conta.html" pegar os dados do usuário e colocar no navegador
app.get("/api/conta", verificaLogin, async (req, res) => {
  const usuario = await db.selectUsuario(req.session.usuario.id);
  res.json({ nome: usuario.nome, saldo: usuario.saldo }); // manda resposta JSON
});

app.get("/api/acao", async (req, res) => {
  fetch(
    "https://financialmodelingprep.com/stable/quote?symbol=GM&apikey=PU4cEBERQg8anYWAqb5CAXY7yOsrj6iW"
  )
    .then((res) => {
      if (res.status === 401) {
        console.log(res.headers);
        res
          .status(401)
          .sendFile(path.join(__dirname, "public", "http401.html"));
      }
      return res.json();
    })
    .then((data) => {
      res.json(data);
    });
});

// rota que redireciona para "conta.html", caso tenha sessão definida
app.get("/conta", verificaLogin, async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "conta.html"));
});

app.get("/acessar-conta", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "acessar-conta.html"));
});

app.get("/teste/:email", async (req, res) => {
  usuario = await db.returnID(req.params.id);
  res.json(usuario);
});

app.get("/cartoes", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cartoes.html"));
});

app.get("/financas", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "financas.html"));
});

app.get("/sobre-nos", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sobre-nos.html"));
});

app.get("/abrir-conta", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "abrir-conta.html"));
});

app.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .send("<h1>500 HTTP</h1><br><h2>Erro ao encerrar a sessão.</h2>");
    }
    res.redirect("/acessar-conta.html");
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "http404.html"));
}); // página custom para 404 HTTP

app.listen(port, host, () => {
  console.log(`Servidor rodando... \x1b[1;34m${host}:${port}\x1b[0;39m`);
});
