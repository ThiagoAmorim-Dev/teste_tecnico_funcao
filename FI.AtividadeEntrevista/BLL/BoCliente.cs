using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using FI.AtividadeEntrevista.DML;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoCliente
    {
        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public long Incluir(DML.Cliente cliente)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();

            if (VerificarExistencia(cliente.CPF))
                throw new Exception("Já existe um cliente cadastrado com esse CPF no sistema.");

            else if (!ValidarCPF(cliente.CPF))
                throw new Exception("O CPF informado não é válido. Por favor, digite novamente.");

            return cli.Incluir(cliente);
        }

        /// <summary>
        /// Altera um cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public void Alterar(DML.Cliente cliente)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();

            DML.Cliente clienteCadastrado = Consultar(cliente.Id);

            if (VerificarExistencia(cliente.CPF) && clienteCadastrado.CPF != cliente.CPF)
                throw new Exception("Já existe um cliente cadastrado com esse CPF no sistema.");

            else if (!ValidarCPF(cliente.CPF))
                throw new Exception("O CPF informado não é válido. Por favor, digite novamente.");

            cli.Alterar(cliente);
        }

        /// <summary>
        /// Consulta o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public DML.Cliente Consultar(long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Consultar(id);
        }

        /// <summary>
        /// Excluir o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public void Excluir(long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            cli.Excluir(id);
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Listar()
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Listar();
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Pesquisa(int iniciarEm, int quantidade, string campoOrdenacao, bool crescente, out int qtd)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Pesquisa(iniciarEm,  quantidade, campoOrdenacao, crescente, out qtd);
        }

        /// <summary>
        /// VerificaExistencia
        /// </summary>
        /// <param name="CPF"></param>
        /// <returns></returns>
        public bool VerificarExistencia(string CPF)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.VerificarExistencia(CPF);
        }



        public bool ValidarCPF(string CPF)
        {
            CPF = new string(CPF.Where(char.IsDigit).ToArray());

            //fazendo uma lista apenas com os números base do cpf
            List<int> CpfBase = CPF.Where(char.IsDigit).Select(c => int.Parse(c.ToString())).ToList();

            //verifica se o cpf tem o número correto de caracteres
            if (CpfBase.Count != 11)
                return false;

            //pegando os últimos dois digitos do cpf (os dvs)
            int dv1 = CpfBase[9];
            int dv2 = CpfBase[10];

            //realizando a verificação do primeiro dv
            List<int> CpfSemOsDoisUltimosDigitos = CpfBase.Take(9).ToList();

            int contador = 10;
            int soma = 0; 

            for (int i = 0;  i < CpfSemOsDoisUltimosDigitos.Count; i++)
            {
                CpfSemOsDoisUltimosDigitos[i] = CpfSemOsDoisUltimosDigitos[i] * contador;
                contador--;
            }

            soma = CpfSemOsDoisUltimosDigitos.Sum() * 10;
            int resultadoDv1 = soma % 11;

            if (resultadoDv1 != dv1)
                return false;



            //realizando a verificação do segundo dv
            List<int> CpfSemUltimoDigito = CpfBase.Take(10).ToList();
            soma = 0;

            contador = 11;
            soma = 0;

            for (int i = 0; i < CpfSemUltimoDigito.Count; i++)
            {
                CpfSemUltimoDigito[i] = CpfSemUltimoDigito[i] * contador;
                contador--;
            }

            soma = CpfSemUltimoDigito.Sum() * 10;
            int resultadoDv2 = soma % 11;

            if (resultadoDv2 == 10 || resultadoDv2 == 1)
                resultadoDv2 = 0;

            if (resultadoDv2 != dv2)
                return false;

            //se passar pelas validações, retorna verdadeiro
            return true;
        }


        public List<DML.Beneficiario> BeneficiarioList(long Id)
        {
            DAL.DaoCliente clienteDAO = new DAL.DaoCliente();
            List<DML.Beneficiario> beneficiarios = clienteDAO.BeneficiarioList(Id);

            return beneficiarios;
        }


        public long AdicionarBeneficiario(DML.Beneficiario beneficiario)
        {
            DAL.DaoCliente clienteDAO = new DAL.DaoCliente();

            beneficiario.CPF = new string(beneficiario.CPF.Where(char.IsDigit).ToArray());

            if (!ValidarCPF(beneficiario.CPF))
                throw new Exception("Cpf inválido. Por favor, digite novamente.");

            if (VerificarCpfBeneficiarioDoCliente(beneficiario.IdCliente, beneficiario.CPF))
                throw new Exception("Já existe um beneficiário para esse cliente com esse CPF");


            beneficiario.CPF = new string(beneficiario.CPF.Where(char.IsDigit).ToArray());
            return clienteDAO.AdicionarBeneficiario(beneficiario);

        }

        public bool VerificarCpfBeneficiarioDoCliente(long IdCliente, string cpf)
        {
            DAL.DaoCliente clienteDAO = new DAL.DaoCliente();
            return clienteDAO.VerificarCpfBeneficiarioDoCliente(IdCliente, cpf);
        }

        public void DeleteBeneficiario(long Id)
        {
            DAL.DaoCliente clienteDAO = new DAL.DaoCliente();
            clienteDAO.DeleteBeneficiario(Id);
        }


        public void EditarBeneficiario(Beneficiario beneficiario)
        {
            DAL.DaoCliente clienteDAO = new DAL.DaoCliente();

            beneficiario.CPF = new string(beneficiario.CPF.Where(char.IsDigit).ToArray());
            clienteDAO.EditarBeneficiario(beneficiario);
        }

    }
}
