#include "api_os.h"
#include "api_debug.h"
#include "api_event.h"

#include "hello.h"

HANDLE helloTaskHandle = NULL;

void HelloTask(void *pData)
{
    while (1)
    {
        Trace(1, "Hello GPRS ");
        OS_Sleep(3000);
    }
}