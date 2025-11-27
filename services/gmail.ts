
// Mock Service for Gmail API Integration

export const gmailService = {
  connect: async (): Promise<boolean> => {
    // Simulate OAuth flow
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Gmail connected successfully.');
        resolve(true);
      }, 1500);
    });
  },

  checkEmails: async (): Promise<any[]> => {
    // Simulate polling for new emails (Lead Intake)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly return a new lead occasionally for demo purposes
        const found = Math.random() > 0.8; 
        if (found) {
            resolve([{
                id: `email-${Date.now()}`,
                from: 'newlead@example.com',
                subject: 'Inquiry about website',
                snippet: 'Hi, I saw your portfolio and...'
            }]);
        } else {
            resolve([]);
        }
      }, 500);
    });
  },

  sendEmail: async (to: string, subject: string, body: string): Promise<boolean> => {
    // Simulate sending an email
    return new Promise((resolve) => {
      console.log(`Sending email to ${to}...`);
      setTimeout(() => {
        console.log(`Email sent to ${to}`);
        resolve(true);
      }, 1000);
    });
  }
};
