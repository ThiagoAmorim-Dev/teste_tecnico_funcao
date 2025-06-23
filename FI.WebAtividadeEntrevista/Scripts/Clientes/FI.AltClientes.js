
$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);

    }

    //ALTERANDO CLIENTE
    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        console.log($(this).find("#CPF").val());

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
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();                                
                window.location.href = urlRetorno;
            }
        });
    })


    //CRIANDO BENEFICIÁRIO
    $('#formBeneficiario').submit(function (e) {
        e.preventDefault();

        const nome = $('#NomeBeneficiario').val().trim();
        const cpf = $('#CPFBeneficiario').val().trim();

        const url = window.location.pathname;
        const partes = url.split('/');
        const idCliente = parseInt(partes[partes.length - 1]);

        $.ajax({
            type: 'POST',
            url: '/Cliente/AdicionarBeneficiario',
            data: {
                Nome: nome,
                CPF: cpf,
                IdCliente: idCliente
            },
            success: function (resposta) {

                $('#tabelaBeneficiarios').append(`
                    <tr>
                        <td>${cpf}</td>
                        <td>${nome}</td>
                        <td class="text-center">
                            <button type="button" class="btn btn-primary">Alterar</button>
                            <button type="button" class="btn btn-danger btn-excluir-beneficiario" data-id="${resposta.Id}">Excluir</button>
                        </td>
                    </tr>
                `);

                // Limpa os campos do formulário
                $('#NomeBeneficiario').val('');
                $('#CPFBeneficiario').val('');
            },
            error: function (erro) {

                if (erro.status == 400)
                    ModalDialog("Ocorreu um erro", erro.responseJSON.Message);
                else if (erro.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            }
        });
    });
  

    //QUANDO O MODAL ABRIR 
    $('#modalBeneficiario').on('shown.bs.modal', function () {
        const url = window.location.pathname;
        const partes = url.split('/');
        const idCliente = parseInt(partes[partes.length - 1]);


        //LISTANDO BENEFICIÁRIOS
        $.ajax({
            type: 'GET',
            url: '/Cliente/BeneficiarioList?id=' + idCliente,
            success: function (beneficiarios) {
                $('#tabelaBeneficiarios').empty();

                beneficiarios.forEach(function (b) {
                    b.CPF = FormatarCpf(b.CPF);

                    $('#tabelaBeneficiarios').append(`
                    <tr>
                        <td>${b.CPF}</td>
                        <td>${b.Nome}</td>
                        <td class="text-center">
                            <button type="button" class="btn btn-primary">Alterar</button>
                            <button type="button" class="btn btn-danger btn-excluir-beneficiario" data-id="${b.Id}">Excluir</button>
                        </td>
                    </tr>
                `);
                });
            },
            error: function () {
                alert("Erro ao carregar beneficiários.");
            }
        });


        //EXCLUIR BENEFICIÁRIO
        $('#tabelaBeneficiarios').on('click', '.btn-excluir-beneficiario', function () {
            const idBeneficiario = $(this).data('id');
            const $linha = $(this).closest('tr');

            $.ajax({
                type: 'POST',
                url: '/Cliente/DeleteBeneficiario?id=' + idBeneficiario,
                success: function () {
                    $linha.remove();
                },
                error: function (erro) {
                    ModalDialog("Erro ao excluir beneficiário", erro);
                }
            });
            
        });
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




function FormatarCpf(cpf) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}
