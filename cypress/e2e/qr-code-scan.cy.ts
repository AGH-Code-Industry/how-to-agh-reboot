describe('QR Code Scan via tRPC', () => {
  const qrCode = 'TEST-QR-CODE-12345';

  it('should return correct scan status from tRPC', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/trpc/qr.submitQr?batch=1',
      body: {
        0: {
          json: qrCode,
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);

      // Poprawka: response.body to tablica
      const result = response.body[0].result?.data?.json;

      expect(result).to.have.property('type');
      expect(['first_time', 'repeated', 'success', 'info', 'error']).to.include(result.type);

      // Jeśli chcesz, możesz też sprawdzić wiadomość:
      expect(result).to.have.property('message');
    });
  });
});
