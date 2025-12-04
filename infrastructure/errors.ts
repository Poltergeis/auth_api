class MissingFieldsError extends Error {
  private missingFields: string[];
  constructor(message?: string, ...missingFields: string[]) {
    super(message);
    this.missingFields = missingFields;
  }

  getMissingFields() {
    return this.missingFields;
  }
}