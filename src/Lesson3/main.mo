actor {
  stable var currentValue: Nat = 0;

  public func increment(): async () {
    currentValue += 1;
  };

  public query func get(): async Nat {
    currentValue
  };

  public func set(value: Nat): async () {
    currentValue := value;
  };
};
