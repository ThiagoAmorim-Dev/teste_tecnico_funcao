CREATE PROCEDURE FI_SP_VerificarCpfBeneficiario
    @CPF VARCHAR(11),
    @IdCliente BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM BENEFICIARIOS
        WHERE CPF = @CPF
          AND IDCLIENTE = @IdCliente
    )
    BEGIN
        SELECT 1 AS Existe;
    END
    ELSE
    BEGIN
        SELECT 0 AS Existe;
    END
END