async function connect() {
  if (global.connection) return global.connection.connect();

  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString:
      "postgres://postgres:sukablyat@localhost:5432/bankeurotal",
  });

  const client = await pool.connect();
  console.log("Criado o pool de conexão.");

  const res = await client.query("SELECT NOW()");
  console.log(res.rows[0]);
  client.release();

  global.connection = pool;
  return client;
}

connect();

async function selectUsuarios() {
  const client = await connect();
  const sql = "SELECT * FROM ContaCorrente";
  const res = await client.query(sql);
  return res.rows[0];
}

async function returnID(email) {
  const client = await connect();
  const sql = "select id from contacorrente where email = $1";
  const res = await client.query(sql, [email]);
  return res.rows[0];
}

async function selectUsuario(id) {
  const client = await connect();
  const sql = "SELECT * FROM ContaCorrente WHERE ID = $1";
  const res = await client.query(sql, [id]);
  return res.rows[0];
}

// async function selectID(id) {
//   const client = await connect();
//   const sql = "select id from contacorrente where id = $1";
//   const res = await client.query()
// }

async function login(email, passwd) {
  const client = await connect();
  const sql =
    "select nome,passwd,saldo,id from contacorrente where email = $1 and passwd = $2";
  const res = await client.query(sql, [email, passwd]);
  if (res.rowCount == 0) {
    // return console.log("ERRO: Email não encontrado.");
    return false;
  }
  return res.rows[0];
}

async function insertUsuario(usuario) {
  try {
    const client = await connect();
    const sql =
      "INSERT INTO ContaCorrente(nome, nickname, email, passwd, numerocelular, ddn, cpf, saldo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    const valores = [
      usuario.nome,
      usuario.nickname,
      usuario.email,
      usuario.passwd,
      usuario.numerocelular,
      usuario.ddn,
      usuario.cpf,
      usuario.saldo,
    ];
    return await client.query(sql, valores);
  } catch (erro) {
    console.error("\u001b[31mERRO! no insertusuario\u001b[0m");
    console.error("\u001b[31m" + erro.message + "\u001b[0m");
    console.error("\u001b[31m" + erro.code + "\u001b[0m");
    return 0;
  }
}

// async function ultimoIDusuario() {
//   const client = await connect();
//   const sql =
//     "select id from contacorrente where id = (select max(id) from contacorrente)";
//   const res = await client.query(sql);
//   return res.rows[0];
// }

// async function verificarUnicidade(usuario) {
// }

module.exports = {
  selectUsuarios,
  selectUsuario,
  insertUsuario,
  login,
  returnID,
};
//   ultimoIDusuario,
//   verificarUnicidade,
// };
