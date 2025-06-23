CREATE PROCEDURE FI_SP_ConsBenefDoCliente
    @IdCliente BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ID AS Id,
        CPF,
        NOME AS Nome,
        IDCLIENTE AS IdCliente
    FROM 
        BENEFICIARIOS
    WHERE 
        IDCLIENTE = @IdCliente;
END
