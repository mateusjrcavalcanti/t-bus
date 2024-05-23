// network.h
#ifndef __GPS_H_
#define __GPS_H_

#include "api_os.h"
#include "api_event.h"

#define GPS_TASK_STACK_SIZE (2048 * 2)
#define GPS_TASK_PRIORITY 1
#define GPS_TASK_NAME "GPS Test Task"

extern HANDLE gpsTaskHandle;

void GPSEventDispatch(API_Event_t *pEvent);
void GPSTask(void *param);

#endif
