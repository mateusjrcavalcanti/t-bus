#include "stdbool.h"
#include "stdint.h"
#include "stdio.h"
#include "string.h"

#include "api_os.h"
#include "api_debug.h"
#include "api_event.h"
#include "api_mqtt.h"
#include "api_network.h"
#include "api_socket.h"
#include "api_info.h"

#include "mqtt.h"
#include "main.h"

char willMsg[50] = "GPRS 123456789012345 disconnected!";
uint8_t imei[16] = "";

HANDLE mqttTaskHandle = NULL;

HANDLE semMqttStart = NULL;
MQTT_Client_t *client = NULL;
MQTT_Connect_Info_t ci;

MQTT_Status_t mqttStatus = MQTT_STATUS_DISCONNECTED;

void mqttEventDispatch(API_Event_t *pEvent)
{
    switch (pEvent->id)
    {

    default:
        break;
    }
}

void OnMqttReceived(void *arg, const char *topic, uint32_t payloadLen)
{
    Trace(1, "MQTT received publish data request, topic:%s, payload length:%d", topic, payloadLen);
}

void OnMqttReceiedData(void *arg, const uint8_t *data, uint16_t len, MQTT_Flags_t flags)
{
    Trace(1, "MQTT recieved publish data,  length:%d,data:%s", len, data);
    if (flags == MQTT_FLAG_DATA_LAST)
        Trace(1, "MQTT data is last frame");
}

void OnMqttSubscribed(void *arg, MQTT_Error_t err)
{
    if (err != MQTT_ERROR_NONE)
        Trace(1, "MQTT subscribe fail,error code:%d", err);
    else
        Trace(1, "MQTT subscribe success,topic:%s", (const char *)arg);
}

void OnMqttConnection(MQTT_Client_t *client, void *arg, MQTT_Connection_Status_t status)
{
    Trace(1, "MQTT connection status:%d", status);
    MQTT_Event_t *event = (MQTT_Event_t *)OS_Malloc(sizeof(MQTT_Event_t));
    if (!event)
    {
        Trace(1, "MQTT no memory");
        return;
    }
    if (status == MQTT_CONNECTION_ACCEPTED)
    {
        Trace(1, "MQTT succeed connect to broker");
        //!!! DO NOT suscribe here(interrupt function), do MQTT suscribe in task, or it will not excute
        event->id = MQTT_EVENT_CONNECTED;
        event->client = client;
        OS_SendEvent(mqttTaskHandle, event, OS_TIME_OUT_WAIT_FOREVER, OS_EVENT_PRI_NORMAL);
    }
    else
    {
        event->id = MQTT_EVENT_DISCONNECTED;
        event->client = client;
        OS_SendEvent(mqttTaskHandle, event, OS_TIME_OUT_WAIT_FOREVER, OS_EVENT_PRI_NORMAL);
        Trace(1, "MQTT connect to broker fail,error code:%d", status);
    }
    Trace(1, "MQTT OnMqttConnection() end");
}

static uint32_t reconnectInterval = 3000;
void StartTimerPublish(uint32_t interval, MQTT_Client_t *client);
void StartTimerConnect(uint32_t interval, MQTT_Client_t *client);
void OnPublish(void *arg, MQTT_Error_t err)
{
    if (err == MQTT_ERROR_NONE)
        Trace(1, "MQTT publish success");
    else
        Trace(1, "MQTT publish error, error code:%d", err);
}

void OnTimerPublish(void *param)
{
    MQTT_Client_t *client = (MQTT_Client_t *)param;
    mqttPublish(param, PUBLISH_PAYLOEAD);
    StartTimerPublish(PUBLISH_INTERVAL, client);
}

void mqttPublish(void *param, const char *payload)
{
    MQTT_Error_t err;
    MQTT_Client_t *client = (MQTT_Client_t *)param;
    uint8_t status = MQTT_IsConnected(client);
    Trace(1, "mqtt status:%d", status);
    if (status != MQTT_STATUS_CONNECTED)
    {
        Trace(1, "MQTT not connected to broker! can not publish");
        return;
    }
    Trace(1, "MQTT OnTimerPublish");
    err = MQTT_Publish(client, PUBLISH_TOPIC, payload, strlen(payload), 1, 2, 0, OnPublish, NULL);
    if (err != MQTT_ERROR_NONE)
        Trace(1, "MQTT publish error, error code:%d", err);
}

void StartTimerPublish(uint32_t interval, MQTT_Client_t *client)
{
    OS_StartCallbackTimer(mainTaskHandle, interval, OnTimerPublish, (void *)client);
}

void OnTimerStartConnect(void *param)
{
    MQTT_Error_t err;
    MQTT_Client_t *client = (MQTT_Client_t *)param;
    uint8_t status = MQTT_IsConnected(client);
    Trace(1, "mqtt status:%d", status);
    if (mqttStatus == MQTT_STATUS_CONNECTED)
    {
        Trace(1, "already connected!");
        return;
    }
    err = MQTT_Connect(client, BROKER_IP, BROKER_PORT, OnMqttConnection, NULL, &ci);
    if (err != MQTT_ERROR_NONE)
    {
        Trace(1, "MQTT connect fail,error code:%d reconnectInerval: %d", err, reconnectInterval);
        reconnectInterval += 1000;
        if (reconnectInterval >= 60000)
            reconnectInterval = 60000;
        StartTimerConnect(reconnectInterval, client);
    }
}

void StartTimerConnect(uint32_t interval, MQTT_Client_t *client)
{
    OS_StartCallbackTimer(mainTaskHandle, interval, OnTimerStartConnect, (void *)client);
}

void MQTTTaskEventDispatch(MQTT_Event_t *pEvent)
{
    switch (pEvent->id)
    {
    case MQTT_EVENT_CONNECTED:
        reconnectInterval = 3000;
        mqttStatus = MQTT_STATUS_CONNECTED;
        Trace(1, "MQTT connected, now subscribe topic:%s", SUBSCRIBE_TOPIC);
        MQTT_Error_t err;
        MQTT_SetInPubCallback(pEvent->client, OnMqttReceived, OnMqttReceiedData, NULL);
        err = MQTT_Subscribe(pEvent->client, SUBSCRIBE_TOPIC, 2, OnMqttSubscribed, (void *)SUBSCRIBE_TOPIC);
        if (err != MQTT_ERROR_NONE)
            Trace(1, "MQTT subscribe error, error code:%d", err);
        // StartTimerPublish(PUBLISH_INTERVAL, pEvent->client);
        break;
    case MQTT_EVENT_DISCONNECTED:
        mqttStatus = MQTT_STATUS_DISCONNECTED;
        StartTimerConnect(reconnectInterval, pEvent->client);
        break;
    default:
        break;
    }
}

void MQTTTask(void *pData)
{
    MQTT_Event_t *event = NULL;

    semMqttStart = OS_CreateSemaphore(0);
    OS_WaitForSemaphore(semMqttStart, OS_WAIT_FOREVER);
    OS_DeleteSemaphore(semMqttStart);
    semMqttStart = NULL;

    Trace(1, "start mqtt test");

    INFO_GetIMEI(imei);
    Trace(1, "IMEI:%s", imei);

    client = MQTT_ClientNew();

    MQTT_Error_t err;
    memset(&ci, 0, sizeof(MQTT_Connect_Info_t));
    ci.client_id = imei;
    ci.client_user = CLIENT_USER;
    ci.client_pass = CLIENT_PASS;
    ci.keep_alive = 20;
    ci.clean_session = 1;
    ci.use_ssl = false;
    ci.will_qos = 2;
    ci.will_topic = "will";
    ci.will_retain = 1;
    memcpy(strstr(willMsg, "GPRS") + 5, imei, 15);
    ci.will_msg = willMsg;

    err = MQTT_Connect(client, BROKER_IP, BROKER_PORT, OnMqttConnection, NULL, &ci);
    if (err != MQTT_ERROR_NONE)
        Trace(1, "MQTT connect fail,error code:%d", err);

    while (1)
    {
        if (OS_WaitEvent(mqttTaskHandle, (void **)&event, OS_TIME_OUT_WAIT_FOREVER))
        {
            MQTTTaskEventDispatch(event);
            OS_Free(event);
        }
    }
}