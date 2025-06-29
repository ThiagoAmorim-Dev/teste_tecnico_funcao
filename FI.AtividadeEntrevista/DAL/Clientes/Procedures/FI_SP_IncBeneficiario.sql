﻿CREATE PROCEDURE FI_SP_IncBeneficiario
    @CPF VARCHAR(14),
    @Nome VARCHAR(50),
    @IdCliente BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO BENEFICIARIOS (CPF, NOME, IDCLIENTE)
    VALUES (@CPF, @Nome, @IdCliente)

    SELECT CAST(SCOPE_IDENTITY() AS BIGINT) AS Id
END

