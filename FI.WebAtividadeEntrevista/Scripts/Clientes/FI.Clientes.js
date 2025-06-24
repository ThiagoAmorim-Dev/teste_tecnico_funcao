let beneficiariosTemp = [];


$(document).ready(function () {

    
    $('#formCadastro').submit(function (e) {
        
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val()
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
                function (r) {
                ModalDialog("Sucesso!", "Cliente cadastro com sucesso.")
                    $("#formCadastro")[0].reset();

                    if (beneficiariosTemp.length > 0) {

                        console.log("ID do cliente:", r.Id);
                        console.log("ID do cliente:", beneficiariosTemp);


                        beneficiariosTemp.forEach(function (b) {
                            b.IdCliente = r.Id;
                        });

                        $.ajax({
                            type: "POST",
                            url: "/Cliente/AdicionarBeneficiarioEmlote",
                            contentType: "application/json",
                            data: JSON.stringify({
                                Beneficiarios: beneficiariosTemp
                            }),
                            success: function () {
                                ModalDialog("Sucesso", "Beneficiários adicionados.");
                                $('#tabelaBeneficiarios').empty();
                                beneficiariosTemp = [];
                            },
                            error: function () {
                                ModalDialog("Erro", "Erro ao adicionar os beneficiários.");
                            }
                        });
                    }


            }
        });
    })

    //CLICANDO EM ALTERAR
    let indiceEdicao = -1;

    $(document).on('click', '.btn-editar-beneficiario', function () {
        const row = $(this).closest('tr');
        indiceEdicao = row.index(); 
        const beneficiario = beneficiariosTemp[indiceEdicao];

        $('#NomeBeneficiario').val(beneficiario.Nome);
        $('#CPFBeneficiario').val(beneficiario.CPF);

        $('#acoesBeneficiario').html(`
            <button type="submit" class="btn btn-primary" id="btnConfirmarAlteracao">Confirmar</button>
            <button type="button" class="btn btn-secondary" id="btnCancelarAlteracao">Cancelar</button>
        `);
    });


    //CANCELANDO ALTERAÇÃO
    $(document).on('click', '#cancelarEdicao', function () {
        indiceEdicao = -1;
        $('#NomeBeneficiario').val('');
        $('#CPFBeneficiario').val('');
        $('#acoesBeneficiario').html(`<button type="submit" class="btn btn-success">Incluir</button>`);
    });

    //CONFIRMANDO ALTERAÇÃO ou INCLUINDO BENEFICIÁRIO
    $('#formBeneficiario').submit(function (e) {
        e.preventDefault();

        const nome = $('#NomeBeneficiario').val().trim();
        const cpf = $('#CPFBeneficiario').val().trim();
        if (nome === "" || cpf === "") return;

        if (indiceEdicao >= 0) {
            // Edição
            beneficiariosTemp[indiceEdicao].Nome = nome;
            beneficiariosTemp[indiceEdicao].CPF = cpf;

            const row = $('#tabelaBeneficiarios').find('tr').eq(indiceEdicao);
            row.find('td').eq(0).text(cpf);
            row.find('td').eq(1).text(nome);

            indiceEdicao = -1;

            $('#acoesBeneficiario').html(`<button type="submit" class="btn btn-success">Incluir</button>`);
        } else {
            // Inclusão
            beneficiariosTemp.push({ Nome: nome, CPF: cpf, IdCliente: 0 });

            $('#tabelaBeneficiarios').append(`
            <tr>
                <td>${cpf}</td>
                <td>${nome}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-primary btn-editar-beneficiario">Alterar</button>
                    <button type="button" class="btn btn-primary btn-remover-beneficiario">Excluir</button>
                </td>
            </tr>
        `);
        }

        $('#NomeBeneficiario').val('');
        $('#CPFBeneficiario').val('');
    });


    //REMOVER BENEFICIÁRIO
    $(document).on('click', '.btn-remover-beneficiario', function () {
        const row = $(this).closest('tr');
        const index = row.index();
        beneficiariosTemp.splice(index, 1); 
        row.remove(); 
    });








    // Evento ao abrir o modal
    $('#modalBeneficiario').on('shown.bs.modal', function () {


        


    });

    












})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
