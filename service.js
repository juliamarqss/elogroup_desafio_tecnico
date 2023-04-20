const calcularDigitoVerificador = (cpf, n1, n2) => {
  const soma = cpf.slice(0, n1).reduce(
    (acc, val, i) => acc + val * (n2 - i), 0
  );
  const digito = (soma % 11 < 2) ? 0 : 11 - soma % 11;
  
  if (cpf[n1] != digito) {
    return false;
  }
}

const verificarCpf = cpf => {
  const digito1 = calcularDigitoVerificador(cpf, 9, 10);
  const digito2 =calcularDigitoVerificador(cpf, 10, 11);

  return digito1 !== false && digito2 !== false;
}

const validarCpf = cpf => {
  if (!cpf) {
    return [];
  }

  const regex = /^\d{11}$/;
  const arrayDeNumeros = cpf.split('').map(Number);

  if (!regex.test(cpf)) {
    return "O CPF deve conter apenas caracteres numéricos.";
  }

  if (!verificarCpf(arrayDeNumeros)) {
    return "Os dígitos verificadores do CPF devem ser válidos.";
  }
}

const validarValor = valor => {
  if (isNaN(valor)) {
    return "Valor deve ser numérico.";
  }

  if (valor > 15000) {
    return "Valor não pode ser superior a 15000,00.";
  }

  if (valor < -2000) {
    return "Valor não pode ser inferior a -2000,00.";
  }
}

const validarEntradaDeDados = lancamento => {
  const cpf = lancamento.cpf;
  const valor = lancamento.valor;
  const mensagemDeErroDoCpf = validarCpf(cpf);
  const mensagemDeErroDoValor = validarValor(valor);

  if (mensagemDeErroDoCpf) {
    return mensagemDeErroDoCpf;
  }

  if (mensagemDeErroDoValor) {
    return mensagemDeErroDoValor;
  }
  
  return null;
}

const recuperarSaldosPorConta = lancamentos => {
  const saldos = lancamentos.reduce((acc, lancamento) => {
    const cpf = lancamento.cpf;
    const valor = lancamento.valor;
    const saldoCpf = acc[cpf];
    acc[cpf] = (saldoCpf || 0) + valor;
    return acc;
  }, {});

  const resultado = Object.entries(saldos).map(
    ([cpf, saldo]) => {
    return { cpf, valor: saldo };
  });

  return resultado;
}

const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => {
  const lancamentosDoCpf = lancamentos.filter(
    (l) => l.cpf === cpf
  );
  const lancamentosOrdenados = lancamentosDoCpf.sort(
    (a, b) => a.valor - b.valor
  );
  
  const maiorLancamento = lancamentosOrdenados[lancamentosOrdenados.length - 1];
  const menorLancamento = lancamentosOrdenados[0];

  if (lancamentosOrdenados.length === 1) {
    return [maiorLancamento, maiorLancamento];
  }

  return [menorLancamento, maiorLancamento];
}

const recuperarMaioresSaldos = lancamentos => {
  const saldos = recuperarSaldosPorConta(lancamentos);
  const lancamentosOrdenados = saldos.sort(
    (a, b) => b.valor - a.valor
  );
  const maioresSaldos = lancamentosOrdenados.slice(0, 3);
  const resultado =  maioresSaldos.reduce(
    (acc, maiorSaldo) => {
      const cpf = maiorSaldo.cpf;
      const valor = maiorSaldo.valor;
      const [menorLancamento, maiorLancamento] = recuperarMaiorMenorLancamentos(
        cpf,
        lancamentos
      );
      acc.push({
        cpf,
        valor,
        menorLancamento: menorLancamento,
        maiorLancamento: maiorLancamento
      });
      return acc;
  }, []);

  return resultado;
}

const recuperarMaioresMedias = lancamentos => {
  const maioresSaldos = recuperarMaioresSaldos(lancamentos);
  const lancamentosOrdenados = maioresSaldos.sort(
    (a, b) => b.valor - a.valor
  );
  const maioresMedias = lancamentosOrdenados.slice(0, 3);

  const resultado = maioresMedias.reduce(
    (acc, maiorMedia) => {
    const cpf = maiorMedia.cpf;
    const valor = maiorMedia.valor;
    const lancamentosDoCpf = lancamentos.filter(
      (lancamento) => lancamento.cpf === cpf
    );
    const media = valor / lancamentosDoCpf.length;
    const mediaFormatada = media.toFixed(2);
    acc.push({
      cpf,
      valor: mediaFormatada
    });
    return acc;
  }, []);

  return resultado;
}
