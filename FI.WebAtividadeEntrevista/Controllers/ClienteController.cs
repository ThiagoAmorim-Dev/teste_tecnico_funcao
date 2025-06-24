using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using FI.WebAtividadeEntrevista.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public System.Web.Mvc.ActionResult Index()
        {
            return View();
        }


        public System.Web.Mvc.ActionResult Incluir()
        {
            return View();
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
            
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                try
                {
                    model.Id = bo.Incluir(new Cliente()
                    {
                        CEP = model.CEP,
                        Cidade = model.Cidade,
                        Email = model.Email,
                        Estado = model.Estado,
                        Logradouro = model.Logradouro,
                        Nacionalidade = model.Nacionalidade,
                        Nome = model.Nome,
                        Sobrenome = model.Sobrenome,
                        Telefone = model.Telefone,
                        CPF = model.CPF

                    });

                    return Json(new {Id = model.Id});
                }
                catch(Exception ex)
                {
                    Response.StatusCode = 400;
                    return Json(ex.Message);
                }
            }
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
       
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                try
                {
                    bo.Alterar(new Cliente()
                    {
                        Id = model.Id,
                        CEP = model.CEP,
                        Cidade = model.Cidade,
                        Email = model.Email,
                        Estado = model.Estado,
                        Logradouro = model.Logradouro,
                        Nacionalidade = model.Nacionalidade,
                        Nome = model.Nome,
                        Sobrenome = model.Sobrenome,
                        Telefone = model.Telefone,
                        CPF = model.CPF
                    });
                               
                    return Json("Cadastro alterado com sucesso");
                }
                catch(Exception ex)
                {
                    Response.StatusCode = 400;
                    return Json(ex.Message);
                }
            }
        }

        [System.Web.Mvc.HttpGet]
        public System.Web.Mvc.ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF

                };

            
            }

            return View(model);
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                Response.StatusCode = 400;
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult AdicionarBeneficiario(BeneficiarioModel beneficiarioModel)
        {

            BoCliente bo = new BoCliente();
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                try
                {
                    long Id = bo.AdicionarBeneficiario(new Beneficiario
                    {
                        CPF = beneficiarioModel.CPF,
                        Nome = beneficiarioModel.Nome,
                        IdCliente = beneficiarioModel.IdCliente
                    });

                    return Json(new {Id = Id});
                }
                catch(Exception ex)
                {
                    Response.StatusCode = 400;
                    return Json(new { Result = "ERROR", Message = ex.Message });
                }
            }
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult AdicionarBeneficiarioEmlote(CadastrarBeneficiarioEmLoteModel request)
        {
            BoCliente bo = new BoCliente();
            List<Beneficiario> beneficiarios = new List<Beneficiario>();

            try
            {
                if (request.Beneficiarios.Count == 0)
                {
                    Response.StatusCode = 400;
                    return Json("Dados Inválidos. Campo beneficiarios não pode ser vazio.");
                }
                else
                {
                    foreach(var beneficiarioModel in request.Beneficiarios)
                    {
                        beneficiarios.Add(new Beneficiario
                        {
                            Nome = beneficiarioModel.Nome,
                            CPF = beneficiarioModel.CPF,
                            IdCliente = beneficiarioModel.IdCliente
                        });
                    }

                    bo.AdicionarBeneficiarioEmLote(beneficiarios);
                    return Json("Beneficiários cadastrados com sucesso.");
                }
            }
            catch(Exception ex)
            {
                Response.StatusCode = 400;
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }





        [System.Web.Mvc.HttpPost]
        public JsonResult DeleteBeneficiario(long Id)
        {

            BoCliente bo = new BoCliente();

            try
            {
                bo.DeleteBeneficiario(Id);
                return Json("Beneficiário deletado com sucesso");
            }
            catch(Exception ex)
            {
                Response.StatusCode = 400;
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult EditarBeneficiario(BeneficiarioModel beneficiarioModel)
        {

            BoCliente bo = new BoCliente();

            try
            {
                bo.EditarBeneficiario(new Beneficiario
                {
                    Id = beneficiarioModel.Id,
                    CPF = beneficiarioModel.CPF,
                    Nome = beneficiarioModel.Nome
                });
                return Json("Beneficiário alterado com sucesso.");
            }
            catch (Exception ex)
            {
                Response.StatusCode = 400;
                return Json(new { Result = "ERROR", Message = ex.Message });
            }

        }

        [System.Web.Mvc.HttpGet]
        public JsonResult BeneficiarioList(long Id)
        {

            BoCliente bo = new BoCliente();

            try
            {
                List<Beneficiario> beneficiarios =  bo.BeneficiarioList(Id);
                return Json(beneficiarios, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                Response.StatusCode = 400;
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }




    }
}