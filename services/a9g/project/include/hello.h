// network.h
#ifndef __HELLO_H_
#define __HELLO_H_

#include "api_os.h"
#include "api_event.h"

#define HELLO_TASK_STACK_SIZE (2048 * 2)
#define HELLO_TASK_PRIORITY 1
#define HELLO_TASK_NAME "Hello Test Task"

extern HANDLE helloTaskHandle;

void HelloTask(void *param);

#endif
