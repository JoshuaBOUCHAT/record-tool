mod redis_handler;
mod socket_handler;

use actix_web::{
    App, HttpResponse, HttpServer, Responder,
    web::{self, get, post},
};

use crate::{
    redis_handler::{redis_get, redis_set},
    socket_handler::ws_handler,
};

use actix_cors::Cors;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap("/api/")
            .wrap(Cors::permissive())
            .route("/ping", get().to(handle_ping))
            .route("/ws/", get().to(ws_handler))
            .route("/set", post().to(redis_set))
            .route("/get", get().to(redis_get))
    })
    .bind(("127.0.0.1", 8070))?
    .run()
    .await
}

async fn handle_ping() -> impl Responder {
    HttpResponse::Ok().body("pong")
}
