class ServiceCommunicationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ServiceCommunicationError';
      this.message = message;
    }
  }
  
  module.exports = ServiceCommunicationError;
  