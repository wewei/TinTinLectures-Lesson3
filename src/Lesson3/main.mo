import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
  stable var currentValue: Nat = 0;

  type HttpRequest = {
    body: Blob;
    headers: [HeaderField];
    method: Text;
    url: Text;
  };

  type HttpResponse = {
    body: Blob;
    headers: [HeaderField];
    status_code: Nat16;
  };

  type HeaderField = (Text, Text);

  public func increment(): async () {
    currentValue += 1;
  };

  public query func get(): async Nat {
    currentValue
  };

  public func set(value: Nat): async () {
    currentValue := value;
  };

  public query func http_request(req: HttpRequest): async HttpResponse {
    let body: Blob = Text.encodeUtf8(Nat.toText(currentValue));
    {
      status_code = 200;
      headers = [("Content-Type", "text/plain"), ("Content.Length", Nat.toText(body.size()))];
      body = body;
    }
  }
};
