#ifndef __DEMO_MQTT_H_
#define __DEMO_MQTT_H_

#include "api_os.h"
#include "api_event.h"

#define MQTT_TASK_STACK_SIZE (2048 * 2)
#define MQTT_TASK_PRIORITY 1
#define MQTT_TASK_NAME "MQTT Test Task"

#define BROKER_IP "unibus.tech"
#define BROKER_PORT 1883
#define CLIENT_USER "BRA2E19"
#define CLIENT_PASS "12345678"
#define SUBSCRIBE_TOPIC "BRA2E19"
#define PUBLISH_TOPIC "BRA2E19"
#define PUBLISH_INTERVAL 10000 // 10s
#define PUBLISH_PAYLOEAD "hello I'm from gprs module"

typedef enum
{
    MQTT_EVENT_CONNECTED = 0,
    MQTT_EVENT_DISCONNECTED,
    MQTT_EVENT_MAX
} MQTT_Event_ID_t;

typedef struct
{
    MQTT_Event_ID_t id;
    MQTT_Client_t *client;
} MQTT_Event_t;

typedef enum
{
    MQTT_STATUS_DISCONNECTED = 0,
    MQTT_STATUS_CONNECTED,
    MQTT_STATUS_MAX
} MQTT_Status_t;

extern HANDLE mqttTaskHandle;
extern HANDLE semMqttStart;
extern MQTT_Client_t *client;
extern MQTT_Status_t mqttStatus;

void mqttEventDispatch(API_Event_t *pEvent);
void MQTTTask(void *pData);
void mqttPublish(void *param, const char *payload);

#endif
