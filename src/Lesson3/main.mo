import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Blob "mo:base/Blob";

actor {
  // type HttpRequest = {
  //   body: Blob;
  //   headers: [HeaderField];
  //   method: Text;
  //   url: Text;
  // };

  // type HttpResponse = {
  //   body: Blob;
  //   headers: [HeaderField];
  //   status_code: Nat16;
  //   streaming_strategy: ?{};
  // };

  // type HeaderField = (Text, Text);

  public type HeaderField = (Text, Text);
  public type HttpRequest = {
    url : Text;
    method : Text;
    body : [Nat8];
    headers : [HeaderField];
  };
  public type HttpResponse = {
    body : [Nat8];
    headers : [HeaderField];
    streaming_strategy : ?StreamingStrategy;
    status_code : Nat16;
  };
  public type Key = Text;
  public type StreamingCallbackHttpResponse = {
    token : ?StreamingCallbackToken;
    body : [Nat8];
  };
  public type StreamingCallbackToken = {
    key : Key;
    sha256 : ?[Nat8];
    index : Nat;
    content_encoding : Text;
  };
  public type StreamingStrategy = {
    #Callback : {
      token : StreamingCallbackToken;
      callback : shared query StreamingCallbackToken -> async ?StreamingCallbackHttpResponse;
    };
  };

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

  public query func http_request(req: HttpRequest): async HttpResponse {
    let body: [Nat8] = Blob.toArray(Text.encodeUtf8(Nat.toText(currentValue)));
    {
      status_code = 200;
      headers = [("Content-Type", "text/plain"), ("Content.Length", Nat.toText(body.size()))];
      body = body;
      streaming_strategy = null;
    }
  }
};
