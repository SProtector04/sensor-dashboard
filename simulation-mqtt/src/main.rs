use rumqttc::{MqttOptions, Client, QoS};
use rand::Rng;
use std::time::Duration;
use tokio::task;
use tokio::time::sleep;

#[tokio::main]
async fn main() {
    // Lista de topics
    let topics = vec![
        "sensor/proximidad",
        "sensor/nivel",
        "motor/temperatura",
        "motor/uso",
    ];

    let broker = "localhost";
    let puerto = 1883;

    let mut handles = vec![];

    for topic in topics {
        let topic = topic.to_string();
        let client_id = format!("pub_{}", topic.replace("/", "_"));
        let broker = broker.to_string();

        let handle = task::spawn(async move {
            let mut mqttoptions = MqttOptions::new(client_id, broker, puerto);
            mqttoptions.set_keep_alive(Duration::from_secs(10));

            let (client, mut connection) = Client::new(mqttoptions, 10);

            // Manejador de conexión (necesario para mantener vivo el cliente)
            std::thread::spawn(move || {
                for event in connection.iter() {
                    println!("Evento MQTT: {:?}", event);
                }
            });

            loop {
                let valor = match topic.as_str() {
                    "sensor/proximidad" => rand::rng().random_range(0.0..100.0), // cm
                    "sensor/nivel" => rand::rng().random_range(0.0..1.0),         // porcentaje
                    "motor/temperatura" => rand::rng().random_range(30.0..90.0), // °C
                    "motor/uso" => rand::rng().random_range(0.0..1.0),           // 0: apagado, 1: encendido
                    _ => 0.0,
                };

                let payload = format!("{:.2}", valor);
                println!("Publicando en {}: {}", topic, payload);
                let _ = client.publish(&topic, QoS::AtLeastOnce, false, payload.clone());

                sleep(Duration::from_millis(500)).await;
            }
        });

        handles.push(handle);
    }

    for h in handles {
        let _ = h.await;
    }
}
