


class Payment {
  // constructor() {
  // }

  public static stripe_percentage = 0.029;

  public static stripe_transaction_cents = 30;

  public static srating_percentage = 0.03;

  public static get_amount_after_fees(amount: number) {
    let pennies = amount * 100;

    pennies = pennies - (pennies * (this.stripe_percentage)) - this.stripe_transaction_cents;

    pennies -= (pennies * this.srating_percentage);

    return +(pennies / 100).toFixed(2);
  }
}

export default Payment;
