use actix::{Actor, StreamHandler};
use actix_web::{App, Error, HttpRequest, HttpServer, Responder, web};
use actix_web_actors::ws;

struct MyWebSocket;

impl Actor for MyWebSocket {
    type Context = ws::WebsocketContext<Self>;
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for MyWebSocket {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        if let Ok(ws::Message::Text(text)) = msg {
            ctx.text(format!("Echo: {}", text));
        }
    }
}

pub async fn ws_handler(req: HttpRequest, stream: web::Payload) -> Result<impl Responder, Error> {
    ws::start(MyWebSocket, &req, stream)
}
