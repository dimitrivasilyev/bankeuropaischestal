-- INSERT INTO contacorrente (nome, nickname, email, passwd, numerocelular, ddn, cpf, saldo) VALUES ('nome1', 'nickname1', 'email1', 'passwd1', '47991022184', '1995-04-21', '69911543005', 12.42); -- exemplo de inserção

-- CREATE TABLE contacorrente (
--     id SERIAL PRIMARY KEY,
--     nome VARCHAR(50) NOT NULL,
--     cpf VARCHAR(14) NOT NULL UNIQUE,
--     ddn DATE NOT NULL,
--     numerocelular VARCHAR(11) NOT NULL,
--     saldo DOUBLE PRECISION NOT NULL,
--     nickname VARCHAR(30) NOT NULL UNIQUE,
--     passwd CHAR(32) NOT NULL,
--     email VARCHAR(50) NOT NULL UNIQUE
-- ); cria uma nova tabela

-- INSERT INTO contacorrente (nome, cpf, ddn, numerocelular, saldo, nickname, passwd, email) VALUES
-- ('João da Silva', '111.111.111-11', '1990-05-10', '11991112222', 1500.50, 'joao_silva', 'senha12345678901234567890123', 'joao.silva@exemplo.com'),
-- ('Maria Oliveira', '222.222.222-22', '1985-08-25', '21988887777', 3200.75, 'maria_oli', 'outrasenha123456789012345678', 'maria.o@exemplo.com'),
-- ('Carlos Pereira', '333.333.333-33', '1992-03-15', '31977776666', 500.00, 'carlos_p', 'senha_forte123456789012345', 'carlos.pereira@exemplo.com'),
-- ('Fernanda Santos', '444.444.444-44', '1995-11-20', '41966665555', 850.25, 'fer_santos', 'senha_aleatoria_1234567890', 'fernanda.s@exemplo.com'),
-- ('Ricardo Almeida', '555.555.555-55', '1980-01-05', '51955554444', 12000.00, 'rick_almeida', 'senha_segura_1234567890123', 'ricardo.a@exemplo.com'); -- outros exemplos para inserção
