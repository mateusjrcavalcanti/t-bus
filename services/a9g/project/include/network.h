// network.h
#ifndef __NETWORK_H_
#define __NETWORK_H_

#include "api_os.h"
#include "api_event.h"

#define PDP_CONTEXT_APN "zap.vivo.com.br"
#define PDP_CONTEXT_USERNAME "vivo"
#define PDP_CONTEXT_PASSWD "vivo"

#define TEST_DNS_TASK_STACK_SIZE (2048 * 2)
#define TEST_DNS_TASK_PRIORITY 1
#define TEST_DNS_TASK_NAME "Test DNS Task"

extern HANDLE TestDNSTaskHandle;

void NetworkEventDispatch(API_Event_t *pEvent);
void TestDNSTask(void *param);

#endif
