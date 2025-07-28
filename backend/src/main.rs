mod socket_handler;

use actix_web::{App, HttpResponse, HttpServer, Responder, get, post, web};

use crate::socket_handler::ws_handler;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/ping", web::get().to(handle_ping))
            .route("/ws/", web::get().to(ws_handler))
    })
    .bind(("127.0.0.1", 8070))?
    .run()
    .await
}

async fn handle_ping() -> impl Responder {
    HttpResponse::Ok().body("pong")
}
