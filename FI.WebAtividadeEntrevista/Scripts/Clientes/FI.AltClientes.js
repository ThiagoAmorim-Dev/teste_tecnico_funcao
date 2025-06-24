let beneficiarioEmEdicao = null;

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

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $("#Nome").val(),
                "CEP": $("#CEP").val(),
                "Email": $("#Email").val(),
                "Sobrenome": $("#Sobrenome").val(),
                "Nacionalidade": $("#Nacionalidade").val(),
                "Estado": $("#Estado").val(),
                "Cidade": $("#Cidade").val(),
                "Logradouro": $("#Logradouro").val(),
                "Telefone": $("#Telefone").val(),
                "CPF": $("#CPF").val()
            },
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
                window.location.href = urlRetorno;
            }
        });
    });

    // Evento ao abrir o modal
    $('#modalBeneficiario').on('shown.bs.modal', function () {
        const url = window.location.pathname;
        const partes = url.split('/');
        const idCliente = parseInt(partes[partes.length - 1]);

        // LISTANDO BENEFICIÁRIOS
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
                            <button type="button" class="btn btn-primary btn-alterar-beneficiario" data-id="${b.Id}">Alterar</button>
                            <button type="button" class="btn btn-primary btn-excluir-beneficiario" data-id="${b.Id}">Excluir</button>
                        </td>
                    </tr>
                `);
                });
            },
            error: function () {
                alert("Erro ao carregar beneficiários.");
            }
        });
    });

    // Submissão do formulário de beneficiário (inserir ou editar)
    $('#formBeneficiario').submit(function (e) {
        e.preventDefault();

        const nome = $('#NomeBeneficiario').val().trim();
        const cpf = $('#CPFBeneficiario').val().trim();

        if (!nome || !cpf) {
            ModalDialog("Atenção", "Preencha todos os campos.");
            return;
        }

        if (beneficiarioEmEdicao) {
            // Modo edição
            $.ajax({
                type: 'POST',
                url: '/Cliente/EditarBeneficiario',
                data: {
                    Id: beneficiarioEmEdicao,
                    Nome: nome,
                    CPF: cpf
                },
                success: function () {
                    ModalDialog("Sucesso", "Beneficiário alterado com sucesso.");
                    $('#modalBeneficiario').modal('hide');
                },
                error: function (erro) {
                    console.log(erro);
                    ModalDialog("Erro", erro.responseJSON.Message);
                },
                complete: function () {
                    beneficiarioEmEdicao = null;
                    resetarFormularioBeneficiario();
                }
            });
        } else {
            // Modo criação
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
                                <button type="button" class="btn btn-primary btn-alterar-beneficiario" data-id="${resposta.Id}">Alterar</button>
                                <button type="button" class="btn btn-primary btn-excluir-beneficiario" data-id="${resposta.Id}">Excluir</button>
                            </td>
                        </tr>
                    `);

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
        }
    });

    // CLICANDO EM ALTERAR
    $('#tabelaBeneficiarios').on('click', '.btn-alterar-beneficiario', function () {
        const $linha = $(this).closest('tr');
        const cpf = $linha.find('td:eq(0)').text().trim();
        const nome = $linha.find('td:eq(1)').text().trim();
        const id = $(this).data('id');

        $('#NomeBeneficiario').val(nome);
        $('#CPFBeneficiario').val(cpf);
        beneficiarioEmEdicao = id;

        $('#acoesBeneficiario').html(`
            <button type="submit" class="btn btn-primary" id="btnConfirmarAlteracao">Confirmar</button>
            <button type="button" class="btn btn-secondary" id="btnCancelarAlteracao">Cancelar</button>
        `);
    });

    // CANCELAR ALTERAÇÃO
    $('#acoesBeneficiario').on('click', '#btnCancelarAlteracao', function () {
        beneficiarioEmEdicao = null;
        resetarFormularioBeneficiario();
    });

    // EXCLUIR BENEFICIÁRIO
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

function resetarFormularioBeneficiario() {
    $('#NomeBeneficiario').val('');
    $('#CPFBeneficiario').val('');
    $('#acoesBeneficiario').html(`
        <button type="submit" class="btn btn-success" id="btnIncluir">Incluir</button>
    `);
}

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var html = '<div id="' + random + '" class="modal fade">                                                               ' +
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
        '                </div>                                                                                             ' +
        '            </div>                                                                                                 ' +
        '        </div>                                                                                                     ' +
        '</div>';

    $('body').append(html);
    $('#' + random).modal('show');
}

function FormatarCpf(cpf) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}
