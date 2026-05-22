import { Fragment, useState } from 'react'
import { Users } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { OrderStatusIcon, cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { OrderStatus, SessionStatus, SessionStatusValues } from '@/constants/type'
import { useTranslations } from 'next-intl'
import { TableListResType } from '@/schemaValidations/table.schema'
import { Badge } from '@/components/ui/badge'
import { ServingGuestByTableNumber, Statics, StatusCountObject } from './order-table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import OrderGuestDetail from './order-guest-detail'

// Ví dụ:
// const statics: Statics = {
//   status: {
//     Pending: 1,
//     Processing: 2,
//     Delivered: 3,
//     Paid: 5,
//     Rejected: 0
//   },
//   table: {
//     1: { // Bàn số 1
//       20: { // Guest 20
//         Pending: 1,
//         Processing: 2,
//         Delivered: 3,
//         Paid: 5,
//         Rejected: 0
//       },
//       21: { // Guest 21
//         Pending: 1,
//         Processing: 2,
//         Delivered: 3,
//         Paid: 5,
//         Rejected: 0
//       }
//     }
//   }
// }
export default function OrderStatics({
  statics,
  tableList,
  servingGuestByTableNumber
}: {
  statics: Statics
  tableList: TableListResType['data']
  servingGuestByTableNumber: ServingGuestByTableNumber
}) {
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(0)
  const selectedServingGuest = servingGuestByTableNumber[selectedTableNumber]
  const t = useTranslations('SessionStatus')
  return (
    <Fragment>
      <Dialog
        open={Boolean(selectedTableNumber)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTableNumber(0)
          }
        }}
      >
        <DialogContent className='max-h-full overflow-auto'>
          {selectedServingGuest && (
            <DialogHeader>
              <DialogTitle>Khách đang ngồi tại bàn {selectedTableNumber}</DialogTitle>
            </DialogHeader>
          )}
          <div>
            {selectedServingGuest &&
              Object.keys(selectedServingGuest).map((guestId, index) => {
                const orders = selectedServingGuest[Number(guestId)]
                return (
                  <div key={guestId}>
                    <OrderGuestDetail guest={orders[0].guest!} order={orders[0]} />
                    {index !== Object.keys(selectedServingGuest).length - 1 && <Separator className='my-5' />}
                  </div>
                )
              })}
          </div>
        </DialogContent>
      </Dialog>
      <div className='flex justify-start items-stretch gap-4 flex-wrap py-4'>
        {tableList.map((table) => {
          const tableNumber: number = table.number
          const tableStatics: Record<number, StatusCountObject> | undefined = statics.table[tableNumber]
          let isEmptyTable = true
          let countObject: StatusCountObject = {
            Pending_Arrival: 0,
            Active: 0,
            Paid: 0,
            Cancelled: 0
          }
          const servingGuestCount = Object.values(servingGuestByTableNumber[tableNumber] ?? []).length
          if (tableStatics) {
            for (const guestId in tableStatics) {
              const guestStatics = tableStatics[Number(guestId)]
              if (
                [guestStatics.Pending_Arrival, guestStatics.Active, guestStatics.Paid].some(
                  (status) => status !== 0 && status !== undefined
                )
              ) {
                isEmptyTable = false
              }
              countObject = {
                Pending_Arrival: countObject.Pending_Arrival + (guestStatics.Pending_Arrival ?? 0),
                Active: countObject.Active + (guestStatics.Active ?? 0),
                Paid: countObject.Paid + (guestStatics.Paid ?? 0),
                Cancelled: countObject.Cancelled + (guestStatics.Cancelled ?? 0)
              }
            }
          }
          return (
            <div
              key={tableNumber}
              className={cn('text-sm flex items-stretch gap-2 border p-2 rounded-md', {
                'bg-secondary': !isEmptyTable,
                'border-transparent': !isEmptyTable
              })}
              onClick={() => {
                if (!isEmptyTable) setSelectedTableNumber(tableNumber)
              }}
            >
              <div className='flex flex-col items-center justify-center gap-2'>
                <div className='font-semibold text-center text-lg'>{tableNumber}</div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className='flex items-center gap-2'>
                        <Users className='h-4 w-4' />
                        <span>{servingGuestCount}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Đang phục vụ: {servingGuestCount} khách</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Separator
                orientation='vertical'
                className={cn('flex-shrink-0 flex-grow h-auto', {
                  'bg-muted-foreground': !isEmptyTable
                })}
              />
              {isEmptyTable && <div className='flex justify-between items-center text-sm'>Ready</div>}
              {!isEmptyTable && (
                <div className='flex flex-col gap-2'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className='flex gap-2 items-center'>
                          <OrderStatusIcon.Pending className='w-4 h-4' />
                          <span>{countObject[SessionStatus.Pending_Arrival] ?? 0}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t(SessionStatus.Pending_Arrival)}: {countObject[SessionStatus.Pending_Arrival] ?? 0}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <div className='flex gap-2 items-center'>
                          <OrderStatusIcon.Processing className='w-4 h-4' />
                          <span>{countObject[SessionStatus.Active] ?? 0}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t(SessionStatus.Active)}: {countObject[SessionStatus.Active] ?? 0}{' '}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className='flex justify-start items-end gap-4 flex-wrap py-4'>
        {SessionStatusValues.map((status) => (
          <Badge variant='secondary' key={status}>
            {t(status)}: {statics.status[status] ?? 0}
          </Badge>
        ))}
      </div>
    </Fragment>
  )
}
