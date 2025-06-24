CREATE PROCEDURE FI_SP_AltBeneficiario
    @ID INT,
    @Nome VARCHAR(100),
    @CPF VARCHAR(11)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Beneficiarios
    SET 
        Nome = @Nome,
        CPF = @CPF
    WHERE 
        ID = @ID;
END
