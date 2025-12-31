
type ErrorHandler = {
  validationError: boolean;
  validationErrorMessage: string | undefined;
}


/**
 * Sigh...
 * This is because OOP > Functional react
 * I want the input ux class to control the error handling
 * But I have no way to access it because thats how react works
 * So each input MUST pass a handler, so I can grab errors on a save button and not have to duplicate code
 */
class Inputs {
  // constructor() {
  // }

  private inputs: Map<string, () => ErrorHandler> = new Map();

  /**
   * Register a functional components error handler
   * pass in a unique ID and a callback function
   */
  public register(id: string, callback: () => ErrorHandler) {
    this.inputs.set(id, callback);
  }
  
  /**
   * Remove a functional components error handler
   * @param id 
  */
 public unregister(id: string) {
    this.inputs.delete(id);
  }
  
  /**
   * Get all the errors for all the inputs by calling a function which is nested instead the functional component
  */
 public getErrors (): ErrorHandler[] {
    const errors: ErrorHandler[] = [];

    for(const [id, callback] of this.inputs) {
      const error = callback();

      if (error.validationError) {
        errors.push(error);
      }
    }

    return errors;
  }


};

export default Inputs;
