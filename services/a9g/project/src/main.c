#include "stdbool.h"
#include "stdint.h"

#include "api_os.h"
#include "api_debug.h"
#include "api_event.h"
#include <api_hal_uart.h>

#include "main.h"
#include "network.h"
#include "hello.h"
#include "pgps.h"

HANDLE mainTaskHandle = NULL;

void MainEventDispatch(API_Event_t *pEvent)
{
    switch (pEvent->id)
    {
    case API_EVENT_ID_NO_SIMCARD:
        Trace(2, "!!NO SIM CARD%d!!!!", pEvent->param1);
        break;
    case API_EVENT_ID_SIMCARD_DROP:
        Trace(2, "!!SIM CARD%d DROP!!!!", pEvent->param1);
        break;
    case API_EVENT_ID_SYSTEM_READY:
        Trace(2, "system initialize complete");
        break;
    default:
        NetworkEventDispatch(pEvent);
        GPSEventDispatch(pEvent);
        break;
    }
}

void MainTask(void *pData)
{
    API_Event_t *event = NULL;

    // Hello Task
    helloTaskHandle = OS_CreateTask(HelloTask,
                                    NULL, NULL, HELLO_TASK_STACK_SIZE, HELLO_TASK_PRIORITY, 0, 0, HELLO_TASK_NAME);

    // Test DNS Task
    TestDNSTaskHandle = OS_CreateTask(TestDNSTask,
                                      NULL, NULL, TEST_DNS_TASK_STACK_SIZE, TEST_DNS_TASK_PRIORITY, 0, 0, TEST_DNS_TASK_NAME);

    // GPS Task
    // open UART1 to print NMEA infomation
    UART_Config_t config = {
        .baudRate = UART_BAUD_RATE_115200,
        .dataBits = UART_DATA_BITS_8,
        .stopBits = UART_STOP_BITS_1,
        .parity = UART_PARITY_NONE,
        .rxCallback = NULL,
        .useEvent = true};
    UART_Init(UART1, config);

    // Create UART1 send task and location print task
    gpsTaskHandle = OS_CreateTask(GPSTask,
                                  NULL, NULL, MAIN_TASK_STACK_SIZE, MAIN_TASK_PRIORITY, 0, 0, MAIN_TASK_NAME);

    while (1)
    {
        if (OS_WaitEvent(mainTaskHandle, (void **)&event, OS_TIME_OUT_WAIT_FOREVER))
        {
            MainEventDispatch(event);
            OS_Free(event->pParam1);
            OS_Free(event->pParam2);
            OS_Free(event);
        }
    }
}

void unibus_Main(void)
{
    mainTaskHandle = OS_CreateTask(MainTask,
                                   NULL, NULL, MAIN_TASK_STACK_SIZE, MAIN_TASK_PRIORITY, 0, 0, MAIN_TASK_NAME);
    OS_SetUserMainHandle(&mainTaskHandle);
}
