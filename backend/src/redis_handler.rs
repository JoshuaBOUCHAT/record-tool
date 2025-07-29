use std::{error::Error, sync::LazyLock};

use actix_web::{HttpResponse, Responder, web};
use redis::{Client, Commands, RedisError, RedisResult};
use serde::{Deserialize, Serialize};

static REDIS_CLIENT: LazyLock<Client> =
    LazyLock::new(|| Client::open("redis://127.0.0.1/").expect("Redis KO"));

#[derive(Deserialize)]
pub struct SetRequest {
    key: String,
    value: String,
}

#[derive(Deserialize)]
pub struct GetRequest {
    key: String,
}

#[derive(Serialize)]
pub struct GetResponse {
    value: Option<String>,
}

#[derive(Serialize)]
pub struct RedisHandlerError {
    error: String,
    code: String,
}
#[derive(Serialize)]
pub struct SetResponse {
    already_contains: bool,
}

pub async fn redis_set(elem: web::Json<SetRequest>) -> Result<HttpResponse, Box<dyn Error>> {
    let mut conn = REDIS_CLIENT.get_connection()?;
    let set_result: bool = conn.set_nx(elem.key.as_str(), elem.value.as_str())?;
    Ok(HttpResponse::Ok().json(SetResponse {
        already_contains: set_result,
    }))
}

pub async fn redis_get(elem: web::Json<GetRequest>) -> Result<HttpResponse, Box<dyn Error>> {
    let mut conn = REDIS_CLIENT.get_connection()?;
    let get_result: Option<String> = conn.get(elem.key.as_str())?;
    Ok(HttpResponse::Ok().json(GetResponse { value: get_result }))
}
