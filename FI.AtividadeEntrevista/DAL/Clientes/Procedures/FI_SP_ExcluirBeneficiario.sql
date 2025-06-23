CREATE PROCEDURE FI_SP_ExcluirBeneficiario
    @IdBeneficiario BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DELETE FROM Beneficiarios
        WHERE ID = @IdBeneficiario;
    END TRY
    BEGIN CATCH
        -- Retorna erro em caso de falha
        DECLARE @ErroMensagem NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErroMensagem, 16, 1);
    END CATCH
END;
